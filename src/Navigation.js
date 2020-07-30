import React from 'react';
import { getUser } from './graphql/queries';
import { onUpdateUser } from './graphql/subscriptions';
import { API, graphqlOperation } from 'aws-amplify';
import { Link } from 'react-router-dom';
