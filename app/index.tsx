import React from 'react';
import { Redirect } from 'expo-router';

export default function RootIndex() {
  // Redirect to auth landing page as the default route
  return <Redirect href="/auth" />;
}