function reducer(s, i) {
  return s instanceof Promise ? s.then(i) : i(s);
}

function onBoard(data) {
  return {
    isRail: true,
    data: data,
  };
}

function createRailReducerFunction(failureActionMessageHandler) {
  const errors = [];
  const success = null;

  function railSystem(state, currentStep, currentIndex, arr) {
    const currentState = (state || {}).isRail ? state : onBoard(state);

    try {
      if (errors.length == 0) {
        const results = {
          ...currentState,
          currentIndex,
          data: reducer(currentState.data, currentStep),
        };

        return currentIndex < arr.length - 1 ? results : results.data;
      }
    } catch (e) {
      errors.push({ message: e.message, stack: e.stack });
      success = false;
      return {
        ...currentState,
        currentIndex,
      };
    }
  }

  railSystem.errors = errors;
  railSystem.success = success;

  return railSystem;
}

export { reducer, createRailReducerFunction };
