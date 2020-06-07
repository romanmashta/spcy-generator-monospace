import React from 'react';
import {storiesOf} from '@storybook/react';

import {HelloComp} from '.';

storiesOf('Hello Component', module).add('Default', () => <HelloComp/>);
