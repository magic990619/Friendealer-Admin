import api from 'app/ApiConfig.js'

// export const GET_COURSES = '[ACADEMY APP] GET COURSES';
export const GET_CATEGORIES = '[ACADEMY APP] GET CATEGORIES';
export const UPDATE_CATEGORY = '[ACADEMY APP] UPDATE CATEGORY';
export const ADD_CATEGORY = '[ACADEMY APP] ADD CATEGORY';
// export const SET_COURSES_SEARCH_TEXT = '[ACADEMY APP] SET COURSES SEARCH TEXT';
// export const SET_COURSES_CATEGORY_FILTER = '[ACADEMY APP] SET COURSES CATEGORY FILTER';

export function getCategories()
{
    return (dispatch) => api.post("/category/getAllCategories", {}).then((response) => {
        dispatch({
            type   : GET_CATEGORIES,
            payload: response.data.doc
        })
    }
    );
}

export function updateCategory(category)
{
    return (dispatch) => api.post("/category/updateCategory", {category}).then((response) => {
        dispatch({
            type   : UPDATE_CATEGORY,
            payload: response.data.doc
        })
    }
    );
}

export function addCategory(category)
{
    return (dispatch) => api.post("/category/addNewCategory", {category}).then((response) => {
        dispatch({
            type   : ADD_CATEGORY,
            payload: response.data.doc
        })
    }
    );
}