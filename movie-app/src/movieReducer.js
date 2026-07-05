// Reducer para manejar el estado de las peliculas
// (los favoritos se manejan con useLocalStorage aparte)
export const movieReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MOVIES':
      return { ...state, movies: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: true };
    default:
      return state;
  }
};

export default movieReducer;
