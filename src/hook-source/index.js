function createWorkInProgressHook(): Hook {
    if (workInProgressHook === null) {
      // This is the first hook in the list
      if (firstWorkInProgressHook === null) {
        isReRender = false;
        currentHook = firstCurrentHook;
        if (currentHook === null) {
          // This is a newly mounted hook
          workInProgressHook = createHook();
        } else {
          // Clone the current hook.
          workInProgressHook = cloneHook(currentHook);
        }
        firstWorkInProgressHook = workInProgressHook;
      } else {
        // There's already a work-in-progress. Reuse it.
        isReRender = true;
        currentHook = firstCurrentHook;
        workInProgressHook = firstWorkInProgressHook;
      }
    } else {
      if (workInProgressHook.next === null) {
        isReRender = false;
        let hook;
        if (currentHook === null) {
          // This is a newly mounted hook
          hook = createHook();
        } else {
          currentHook = currentHook.next;
          if (currentHook === null) {
            // This is a newly mounted hook
            hook = createHook();
          } else {
            // Clone the current hook.
            hook = cloneHook(currentHook);
          }
        }
        // Append to the end of the list
        workInProgressHook = workInProgressHook.next = hook;
      } else {
        // There's already a work-in-progress. Reuse it.
        isReRender = true;
        workInProgressHook = workInProgressHook.next;
        currentHook = currentHook !== null ? currentHook.next : null;
      }
    }
    return workInProgressHook;
  }