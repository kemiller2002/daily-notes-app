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

  function railSystem(state, currentStep, currentIndex, arr) {
    const currentState = (state || {}).isRail ? state : onBoard(state);
    const stepArray = arr || [];

    if (currentIndex >= stepArray.length) {
      const data = currentState.data;

      if (errors.length > 0) {
        failureActionMessageHandler(...errors);
      }
      return data;
    }

    try {
      if (errors.length == 0) {
        const results = {
          ...currentState,
          currentIndex,
          data: reducer(currentState.data, currentStep),
        };

        return results;
      }
    } catch (e) {
      errors.push({ message: e.message, stack: e.stack });
      return {
        ...currentState,
        currentIndex,
      };
    }
  }

  railSystem.errors = errors;
  railSystem.success = null;

  return railSystem;
}

export { reducer, createRailReducerFunction };
