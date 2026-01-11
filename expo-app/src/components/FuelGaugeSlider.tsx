import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, PanResponder } from 'react-native';
import Svg, { Path, Circle, Line, G, Defs, LinearGradient, Stop } from 'react-native-svg';

interface FuelGaugeSliderProps {
  value: number; // 0-1 (E to F)
  onChange: (val: number) => void;
  disabled?: boolean;
}

const FuelGaugeSlider: React.FC<FuelGaugeSliderProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const width = Dimensions.get('window').width - 80;
  const height = 180;
  const centerX = width / 2;
  const centerY = height - 20;
  const radius = Math.min(width, height) * 0.7;
  
  // Gauge arc spans from -135° to 135° (270° total)
  const startAngle = -135 * (Math.PI / 180);
  const endAngle = 135 * (Math.PI / 180);
  const totalAngle = endAngle - startAngle;
  
  // Calculate needle angle based on value
  const needleAngle = startAngle + (value * totalAngle);
  
  // Create arc path for gauge background
  const createArcPath = (innerRadius: number, outerRadius: number) => {
    const startX = centerX + Math.cos(startAngle) * outerRadius;
    const startY = centerY + Math.sin(startAngle) * outerRadius;
    const endX = centerX + Math.cos(endAngle) * outerRadius;
    const endY = centerY + Math.sin(endAngle) * outerRadius;
    
    const innerStartX = centerX + Math.cos(startAngle) * innerRadius;
    const innerStartY = centerY + Math.sin(startAngle) * innerRadius;
    const innerEndX = centerX + Math.cos(endAngle) * innerRadius;
    const innerEndY = centerY + Math.sin(endAngle) * innerRadius;
    
    return `
      M ${startX} ${startY}
      A ${outerRadius} ${outerRadius} 0 1 1 ${endX} ${endY}
      L ${innerEndX} ${innerEndY}
      A ${innerRadius} ${innerRadius} 0 1 0 ${innerStartX} ${innerStartY}
      Z
    `;
  };
  
  // Calculate needle endpoint
  const needleLength = radius * 0.8;
  const needleX = centerX + Math.cos(needleAngle) * needleLength;
  const needleY = centerY + Math.sin(needleAngle) * needleLength;
  
  // Handle touch interactions
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !disabled,
    onMoveShouldSetPanResponder: () => !disabled,
    onPanResponderGrant: () => {
      setIsDragging(true);
    },
    onPanResponderMove: (_, gestureState) => {
      const touchX = gestureState.moveX;
      const touchY = gestureState.moveY;
      
      // Convert touch position to angle
      const dx = touchX - centerX;
      const dy = touchY - centerY;
      let angle = Math.atan2(dy, dx);
      
      // Normalize angle to 0-1 range
      if (angle < startAngle) angle = startAngle;
      if (angle > endAngle) angle = endAngle;
      
      const normalizedValue = (angle - startAngle) / totalAngle;
      onChange(Math.max(0, Math.min(1, normalizedValue)));
    },
    onPanResponderRelease: () => {
      setIsDragging(false);
    },
  });
  
  // Get color based on fuel level
  const getGaugeColor = () => {
    if (value < 0.25) return '#FF3B30'; // Red
    if (value < 0.5) return '#FF9500'; // Orange
    return '#34C759'; // Green
  };
  
  // Get label text
  const getLevelText = () => {
    if (value < 0.15) return 'E';
    if (value > 0.85) return 'F';
    if (value >= 0.45 && value <= 0.55) return '½';
    return '';
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.gaugeContainer} {...panResponder.panHandlers}>
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FF3B30" stopOpacity="1" />
              <Stop offset="50%" stopColor="#FFCC00" stopOpacity="1" />
              <Stop offset="100%" stopColor="#34C759" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          
          {/* Background arc */}
          <Path
            d={createArcPath(radius * 0.7, radius * 0.9)}
            fill="#E5E5E7"
          />
          
          {/* Colored gauge arc */}
          <Path
            d={createArcPath(radius * 0.7, radius * 0.9)}
            fill="url(#gaugeGradient)"
            opacity={0.8}
          />
          
          {/* Tick marks */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick, index) => {
            const tickAngle = startAngle + tick * totalAngle;
            const tickStartRadius = radius * 0.88;
            const tickEndRadius = radius * 0.72;
            const x1 = centerX + Math.cos(tickAngle) * tickStartRadius;
            const y1 = centerY + Math.sin(tickAngle) * tickStartRadius;
            const x2 = centerX + Math.cos(tickAngle) * tickEndRadius;
            const y2 = centerY + Math.sin(tickAngle) * tickEndRadius;
            
            return (
              <Line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#666"
                strokeWidth={tick === 0 || tick === 0.5 || tick === 1 ? 3 : 2}
              />
            );
          })}
          
          {/* Needle */}
          <G>
            <Line
              x1={centerX}
              y1={centerY}
              x2={needleX}
              y2={needleY}
              stroke={getGaugeColor()}
              strokeWidth={4}
              strokeLinecap="round"
            />
            <Circle
              cx={centerX}
              cy={centerY}
              r={8}
              fill={getGaugeColor()}
            />
          </G>
        </Svg>
        
        {/* Labels */}
        <View style={[styles.label, styles.labelLeft]}>
          <Text style={styles.labelText}>E</Text>
        </View>
        <View style={[styles.label, styles.labelCenter]}>
          <Text style={styles.labelText}>½</Text>
        </View>
        <View style={[styles.label, styles.labelRight]}>
          <Text style={styles.labelText}>F</Text>
        </View>
      </View>
      
      {/* Value display */}
      <View style={styles.valueContainer}>
        <Text style={[styles.valueText, { color: getGaugeColor() }]}>
          {getLevelText() || `${Math.round(value * 100)}%`}
        </Text>
        <Text style={styles.valueSubtext}>Fuel Level</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  gaugeContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    bottom: 10,
  },
  labelLeft: {
    left: 20,
  },
  labelCenter: {
    bottom: 5,
  },
  labelRight: {
    right: 20,
  },
  labelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  valueContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  valueText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  valueSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default FuelGaugeSlider;
