import {NavigationContainerRef} from '@react-navigation/core';
import React, {useRef, useState} from 'react';

export const NaviContainer =
  useRef<NavigationContainerRef<ReactNavigation.RootParamList>>();
