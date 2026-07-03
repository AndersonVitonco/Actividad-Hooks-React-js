export const SET_MOVIES = 'SET_MOVIES';
export const SET_LOADING = 'SET_LOADING';
export const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';

const movieReducer = (state, action) => {
  switch (action.type) {
    case SET_MOVIES:
      return {
        ...state,
        movies: action.payload,
        loading: false,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case TOGGLE_FAVORITE:
      return {
        ...state,
        movies: state.movies.map((movie) =>
          movie.id === action.payload
            ? { ...movie, favorite: !movie.favorite }
            : movie
        ),
      };
    default:
      return state;
  }
};

export default movieReducer;
