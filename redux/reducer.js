const initialState = {animal: ''};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CAT':
      return {...state, animal: 'cat'};

    case 'DOG':
      return {...state, animal: 'dog'};
    case 'RESET':
      return {...state, animal: ''};
    default:
      return state;
  }
};
