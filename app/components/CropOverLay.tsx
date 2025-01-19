import React, { useState, useRef } from "react";
import {
  View,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const CropOverlay = ({
  onRegionSelected,
  containerWidth = SCREEN_WIDTH - 30,
  containerHeight = SCREEN_WIDTH -30,
}: {
  onRegionSelected: (props: any) => void;
  containerWidth?: number;
  containerHeight?: number;
}) => {
  // Track the position and size of crop box
  const [cropSize, setCropSize] = useState({
    width: containerWidth - 30,
    height: containerWidth - 30,
  });

  const position = useRef(
    new Animated.ValueXY({
      x: 15,
      y: 15,
    })
  ).current;

  const initialTouchPos = useRef({ x: 0, y: 0 });
  const initialCropState = useRef({
    size: { width: 0, height: 0 },
    position: { x: 0, y: 0 },
  });

  const constrainValue = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };

  const createCornerPanResponder = (corner: string) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        initialTouchPos.current = {
          x: evt.nativeEvent.pageX,
          y: evt.nativeEvent.pageY,
        };
        initialCropState.current = {
          size: { ...cropSize },
          position: {
            x: position.x._value,
            y: position.y._value,
          },
        };
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        let newWidth = initialCropState.current.size.width;
        let newHeight = initialCropState.current.size.height;
        let newX = initialCropState.current.position.x;
        let newY = initialCropState.current.position.y;

        const minSize = 50;

        switch (corner) {
          case "topLeft":
            // Calculate potential new values
            const potentialWidthTL = initialCropState.current.size.width - dx;
            const potentialHeightTL = initialCropState.current.size.height - dy;
            const potentialXTL = initialCropState.current.position.x + dx;
            const potentialYTL = initialCropState.current.position.y + dy;

            // Apply constraints
            newWidth = constrainValue(
              potentialWidthTL,
              minSize,
              initialCropState.current.position.x +
                initialCropState.current.size.width
            );
            newHeight = constrainValue(
              potentialHeightTL,
              minSize,
              initialCropState.current.position.y +
                initialCropState.current.size.height
            );
            newX = constrainValue(
              potentialXTL,
              0,
              initialCropState.current.position.x +
                initialCropState.current.size.width -
                minSize
            );
            newY = constrainValue(
              potentialYTL,
              0,
              initialCropState.current.position.y +
                initialCropState.current.size.height -
                minSize
            );
            break;

          case "topRight":
            newWidth = constrainValue(
              initialCropState.current.size.width + dx,
              minSize,
              containerWidth - initialCropState.current.position.x
            );
            newHeight = constrainValue(
              initialCropState.current.size.height - dy,
              minSize,
              initialCropState.current.position.y +
                initialCropState.current.size.height
            );
            newY = constrainValue(
              initialCropState.current.position.y + dy,
              0,
              initialCropState.current.position.y +
                initialCropState.current.size.height -
                minSize
            );
            break;

          case "bottomLeft":
            newWidth = constrainValue(
              initialCropState.current.size.width - dx,
              minSize,
              initialCropState.current.position.x +
                initialCropState.current.size.width
            );
            newHeight = constrainValue(
              initialCropState.current.size.height + dy,
              minSize,
              containerHeight - initialCropState.current.position.y
            );
            newX = constrainValue(
              initialCropState.current.position.x + dx,
              0,
              initialCropState.current.position.x +
                initialCropState.current.size.width -
                minSize
            );
            break;

          case "bottomRight":
            newWidth = constrainValue(
              initialCropState.current.size.width + dx,
              minSize,
              containerWidth - initialCropState.current.position.x
            );
            newHeight = constrainValue(
              initialCropState.current.size.height + dy,
              minSize,
              containerHeight - initialCropState.current.position.y
            );
            break;
        }

        console.log(
          "corner",
          {containerHeight,
          corner,
          newWidth,
          newHeight,
          newX,
          newY,
          dx,
          dy}
        );

        // Update position and size
        position.setValue({ x: newX, y: newY });
        setCropSize({ width: newWidth, height: newHeight });
      },
      onPanResponderRelease: () => {
        const region = {
          x: position.x._value,
          y: position.y._value,
          width: cropSize.width,
          height: cropSize.height,
          corner: corner,
        };

        if (onRegionSelected) {
          onRegionSelected(region);
        }
      },
    });

  const cornerPanResponders = {
    topLeft: useRef(createCornerPanResponder("topLeft")).current,
    topRight: useRef(createCornerPanResponder("topRight")).current,
    bottomLeft: useRef(createCornerPanResponder("bottomLeft")).current,
    bottomRight: useRef(createCornerPanResponder("bottomRight")).current,
  };

  return (
    <View
      style={[
        styles.container,
        { width: containerWidth, height: containerHeight },
      ]}
    >
      <Animated.View
        style={[
          styles.cropBox,
          {
            transform: position.getTranslateTransform(),
            width: cropSize.width,
            height: cropSize.height,
          },
        ]}
      >
        <View
          {...cornerPanResponders.topLeft.panHandlers}
          style={[styles.cropCorner, styles.topLeft]}
        />
        <View
          {...cornerPanResponders.topRight.panHandlers}
          style={[styles.cropCorner, styles.topRight]}
        />
        <View
          {...cornerPanResponders.bottomLeft.panHandlers}
          style={[styles.cropCorner, styles.bottomLeft]}
        />
        <View
          {...cornerPanResponders.bottomRight.panHandlers}
          style={[styles.cropCorner, styles.bottomRight]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
  cropBox: {
    // position: "absolute",
    borderWidth: 2,
    borderColor: "#8ab4f8",
    backgroundColor: "rgba(138, 180, 248, 0.1)",
  },
  cropCorner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#8ab4f8",
    backgroundColor: "rgba(138, 180, 248, 0.2)",
    zIndex: 2,
  },
  topLeft: {
    top: -15,
    left: -15,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  topRight: {
    top: -15,
    right: -15,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bottomLeft: {
    bottom: -15,
    left: -15,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bottomRight: {
    bottom: -15,
    right: -15,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
});

export default CropOverlay;
