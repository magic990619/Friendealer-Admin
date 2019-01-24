import api from 'app/ApiConfig.js'

// export const GET_COURSES = '[ACADEMY APP] GET COURSES';
export const GET_CATEGORIES = '[ACADEMY APP] GET CATEGORIES';
// export const SET_COURSES_SEARCH_TEXT = '[ACADEMY APP] SET COURSES SEARCH TEXT';
// export const SET_COURSES_CATEGORY_FILTER = '[ACADEMY APP] SET COURSES CATEGORY FILTER';

export function getCategories()
{
    return (dispatch) => api.get("/category/getAllMainCategories", {}).then((response) => {
        dispatch({
            type   : GET_CATEGORIES,
            payload: response.data.doc
        })
    }
    );
}