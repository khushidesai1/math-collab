/**
 * Build styles
 */
const katex = require("katex");
require('./index.css');
require("katex/dist/katex.css");

/**
 * Math Block for the Editor.js.
 * Render Tex syntax/plain text to pretty math equations
 *
 * @author flaming-cl
 * @license The MIT License (MIT)
 */

/**
 * @typedef {Object} MathData
 * @description Tool's input and output data format
 * @property {String} text — Math's content. Can include HTML tags: <a><b><i>
 */
class Math {
  /**
   * Default placeholder for Math Tool
   *
   * @return {string}
   * @constructor
   */
  static get DEFAULT_PLACEHOLDER() {
    return '';
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: MathData, config: object, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   */
  constructor({data, config, api}) {
    this.api = api;

    this._CSS = {
      block: this.api.styles.block,
      wrapper: 'ce-Math'
    };
    this.onKeyUp = this.onKeyUp.bind(this);

    this._placeholder = config.placeholder ? config.placeholder : Math.DEFAULT_PLACEHOLDER;
    this._data = {};
    this._element = this.drawView();

    this.config = {
      fleqn: true,
      output: 'html',
      delimiter: '$$',
      throwOnError: true,
      displayMode: true,
    };

    this.data = data;
  }

  /**
   * Check if text content is empty and set empty string to inner html.
   * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
   *
   * @param {KeyboardEvent} e - key up event
   */
  onKeyUp(e) {
    const { textContent } = this._element;
    if (e.code === 'Space') {
      this.handleAutoInsert();
    }
    this.renderKatex();
    if (e.code !== 'Backspace' && e.code !== 'Delete') {
      return;
    }
    if (textContent === '') {
      this._element.innerHTML = '';
    }
  }

  /**
   * Change block editing state - rendering Katex or being editable
   */
  onClick(e) {
    if (!this.textNode || !this.katexNode || e.target === this.textNode) return;
    this.textNode.hidden = !(this.textNode.hidden);
    this.textNode.autofocus = true;
    const inputError = this.katexNode.innerText.indexOf('ParseError') > -1;
    if (this.textNode.hidden === true && inputError) {
      katex.render(this.textBeforeError, this.katexNode, this.config);
    }
  }

  /**
   * switch the block to editable mode
   */
  enableEditing() {
    if (this.textNode) {
      return this.textNode.hidden = false;
    }

    this.textNode = document.createElement('input');
    this.textNode.contentEditable = true;
    this.textNode.value = this.data.text;
    this.textNode.hidden = true;
    this.textNode.className = 'text-node';
    this._element.appendChild(this.textNode);
  }

  /**
   * Create Tool's view
   * @return {HTMLElement}
   * @private
   */
  drawView() {
    const div = document.createElement('DIV');

    div.classList.add(this._CSS.wrapper, this._CSS.block);
    div.contentEditable = true;
    div.dataset.placeholder = this._placeholder;
    this.katexNode = document.createElement('div');
    this.katexNode.id = 'katex-node';
    this.katexNode.contentEditable = false;
    div.appendChild(this.katexNode);

    div.addEventListener('keyup', this.onKeyUp);
    return div;
  }

  /**
   * Return Tool's view
   * @returns {HTMLDivElement}
   * @public
   */
  render() {
    this.renderKatex();
    this.enableEditing();
    this._element.addEventListener('click', (e) => this.onClick(e));
    // this._element.classList.add(this.api.styles.inlineToolButton);
    return this._element;
  }

  /**
   * Return Tool's view
   * @returns {HTMLDivElement}
   */
  renderKatex() {
    this.data.text = this.textNode ? this.textNode.value : this.data.text;
    this.textToKatex();
  }

  setCursorPosition(pos, elem) {
    if (elem.setSelectionRange) {
      elem.setSelectionRange(pos, pos);
    } else if (elem.createTextRange) {
      var range = elem.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }

  handleAutoInsert() {
    const fullSumIndex = this.data.text.lastIndexOf("\\sum_{");
    let currText = this.data.text;
    let startText = "";
    if (fullSumIndex >= 0) {
      startText = currText.substring(0, fullSumIndex + 3);
      currText = currText.substring(fullSumIndex + 3);
    }
    const newSumIndex1 = currText.indexOf("\\sum");
    const newSumIndex2 = currText.indexOf("sum");
    if (newSumIndex1 >= 0 || newSumIndex2 >= 0) {
      if (currText.indexOf("\\sum") < 0) {
        this.textNode.value = startText + currText.replace("sum", "\\sum_{}^{}");
      } else {
        this.textNode.value = startText + currText.replace("\\sum", "\\sum_{}^{}");
      }
      this.setCursorPosition(this.textNode.value.indexOf("\\sum_{}^{}") + 6, this.textNode);
    }
    if (this.data.text.indexOf("/") >= 0) {
      this.textNode.value = this.data.text.replace("/", "\\frac{}{}");
      this.setCursorPosition(this.textNode.value.indexOf("\\frac{}{}") + 6, this.textNode);
    }
  }

  /**
   * parsing the current text to Tex syntax if it has not been transformed
   */
  textToKatex() {
    if (!this.data.text) {
      this.data.text = 'equation';
    }

    if (!this.katexNode) return;

    if (this._element.innerText.indexOf('ParseError') < 0) {
      this.textBeforeError = this._element.innerText;
    }

    try {
      katex.render(this.data.text, this.katexNode, this.config);
    } catch (e) {
      const errorMsg = 'Invalid Equation. ' + e.toString();
      this.katexNode.innerText = errorMsg;
    }
  }

  /**
   * content inside Math is unchangeable.
   * @param {MathData} data
   * @public
   */
  merge(data) {
    this.data = this.data;
  }

  /**
   * Validate Math block data:
   * - check for emptiness
   *
   * @param {MathData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(savedData) {
    if (savedData.text.trim() === '') {
      return false;
    }

    return true;
  }

  /**
   * content inside Math is unchangeable
   * @param {HTMLDivElement} toolsContent - Math tools rendered view
   * @returns {MathData} - saved data
   * @public
   */
  save(toolsContent) {
    return {
      text: this.data.text
    };
  }

  /**
   * On paste callback fired from Editor.
   *
   * @param {PasteEvent} event - event with pasted data
   */
  onPaste(event) {
    const data = {
      text: event.detail.data.innerHTML
    };

    this.data = data;
  }

  /**
   * Enable Conversion Toolbar. Math can be converted to/from other tools
   */
  static get conversionConfig() {
    return {
      export: 'text', // to convert Math to other block, use 'text' property of saved data
      import: 'text' // to covert other block's exported string to Math, fill 'text' property of tool data
    };
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        br: true,
        svg: true
      }
    };
  }

  /**
   * Get current Tools`s data
   * @returns {MathData} Current data
   * @private
   */
  get data() {
    return this._data;
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {MathData} data — data to set
   * @private
   */
  set data(data) {
    this._data = data || {};

    this.katexNode.innerHTML = this._data.text || '';
  }

  /**
   * Used by Editor paste handling API.
   * Provides configuration to handle P tags.
   *
   * @returns {{tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: [ 'P' ]
    };
  }

  /**
   * Icon and title for displaying at the Toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 142.514 142.514" xmlns:v="https://vecta.io/nano"><path d="M34.367 142.514c11.645 0 17.827-10.4 19.645-16.544a6.43 6.43 0 0 0 .081-.297l15.983-65.58h17.886a6.09 6.09 0 1 0 0-12.18h-14.86l3.232-12.46.512-1.734c1.888-6.443 6.3-21.535 13.146-21.535 6.34 0 7.285 9.764 7.328 10.236.27 3.343 3.186 5.868 6.537 5.58a6.09 6.09 0 0 0 5.605-6.539C108.894 14.036 104.087 0 90 0 74.03 0 68.038 20.458 65.16 30.292l-.5 1.66c-.585 1.946-2.12 7.942-4.122 15.962H39.24a6.09 6.09 0 1 0 0 12.18h18.3L42.307 122.6c-.332.965-2.83 7.742-7.937 7.742-7.8 0-11.177-10.948-11.204-11.03-.936-3.23-4.305-5.098-7.544-4.156-3.23.937-5.092 4.314-4.156 7.545 2.13 7.36 9.35 19.822 22.9 19.822zm90.318-15.704c3.6 0 6.605-2.55 6.605-6.607 0-1.885-.754-3.586-2.36-5.474l-12.646-14.534 12.27-14.346c1.132-1.416 1.98-2.926 1.98-4.908 0-3.6-2.927-6.23-6.703-6.23-2.547 0-4.527 1.604-6.23 3.684l-9.53 12.454-9.34-12.46c-1.9-2.357-3.87-3.682-6.7-3.682-3.6 0-6.607 2.55-6.607 6.6 0 1.885.756 3.586 2.357 5.47l11.8 13.592-12.932 15.3c-1.227 1.416-1.98 2.926-1.98 4.908 0 3.6 2.926 6.23 6.7 6.23 2.55 0 4.53-1.604 6.23-3.682l10.2-13.4 10.193 13.4c1.894 2.363 3.876 3.684 6.707 3.684z"/></svg>',
      title: 'Math'
    };
  }
}

module.exports = Math;