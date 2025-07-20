// File: App.js
import React from 'react';
// import SkatingTrackerBLE from './components/SkatingTrackerBLE';
// import StepTracker from './components/StepTracker';
import SkatingTrackerBLE from './SkatingTrackerBLE';
import StepTracker from './StepTracker';
import { View, Button } from 'react-native';

export default function Apps() {
  const [showSteps, setShowSteps] = React.useState(false);

  return (
    <View style={{ flex: 1 }}>
      {showSteps ? <StepTracker /> : <SkatingTrackerBLE />}
      <Button
        title={showSteps ? '⬅️ Back to Skating' : '➡️ Go to Step Tracker'}
        onPress={() => setShowSteps(!showSteps)}
      />
    </View>
  );
}