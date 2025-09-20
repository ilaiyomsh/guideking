import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as api from '../services/api';

const GuideContext = createContext();

const initialState = {
  guides: [],
  currentGuide: null,
  loading: false,
  error: null,
  isEditing: false,
  hasUnsavedChanges: false
};

function guideReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_GUIDES':
      return { ...state, guides: action.payload, loading: false };
    
    case 'SET_CURRENT_GUIDE':
      return { 
        ...state, 
        currentGuide: action.payload ? {
          ...action.payload,
          homePage: action.payload.homePage || {
            title: 'ברוכים הבאים למדריך!',
            content: 'מדריך זה נועד לסייע לכם. הוא מחולק למספר פרקים, וכל אחד מהם מכסה נושא חשוב.\n\nכדי להתחיל, בחרו את הפרק הרצוי מסרגל הניווט.'
          }
        } : null,
        loading: false,
        hasUnsavedChanges: false,
        isEditing: !!action.payload
      };
    
    case 'UPDATE_CURRENT_GUIDE':
      return { 
        ...state, 
        currentGuide: action.payload,
        hasUnsavedChanges: true
      };
    
    case 'CLEAR_CURRENT_GUIDE':
      return { 
        ...state, 
        currentGuide: null, 
        isEditing: false,
        hasUnsavedChanges: false
      };
    
    case 'CREATE_NEW_GUIDE':
      return {
        ...state,
        currentGuide: {
          title: 'מדריך חדש',
          homePage: {
            title: 'ברוכים הבאים למדריך!',
            content: 'מדריך זה נועד לסייע לכם. הוא מחולק למספר פרקים, וכל אחד מהם מכסה נושא חשוב.\n\nכדי להתחיל, בחרו את הפרק הרצוי מסרגל הניווט.'
          },
          chapters: []
        },
        isEditing: true,
        hasUnsavedChanges: true
      };
    
    case 'SAVE_SUCCESS':
      return {
        ...state,
        hasUnsavedChanges: false,
        error: null
      };
    
    default:
      return state;
  }
}

export function GuideProvider({ children }) {
  const [state, dispatch] = useReducer(guideReducer, initialState);

  // Load guides on mount
  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const guides = await api.getGuides();
      dispatch({ type: 'SET_GUIDES', payload: guides });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const loadGuide = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const guide = await api.getGuide(id);
      dispatch({ type: 'SET_CURRENT_GUIDE', payload: guide });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createNewGuide = () => {
    dispatch({ type: 'CREATE_NEW_GUIDE' });
  };

  const updateCurrentGuide = (updatedGuide) => {
    dispatch({ type: 'UPDATE_CURRENT_GUIDE', payload: updatedGuide });
  };

  const saveCurrentGuide = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (state.currentGuide._id) {
        // Update existing guide
        await api.updateGuide(state.currentGuide._id, state.currentGuide);
      } else {
        // Create new guide
        const newGuide = await api.createGuide(state.currentGuide);
        dispatch({ type: 'SET_CURRENT_GUIDE', payload: newGuide });
      }
      
      dispatch({ type: 'SAVE_SUCCESS' });
      await loadGuides(); // Refresh guides list
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return false;
    }
  };

  const deleteGuide = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await api.deleteGuide(id);
      
      // If we're currently editing the deleted guide, clear it
      if (state.currentGuide && state.currentGuide._id === id) {
        dispatch({ type: 'CLEAR_CURRENT_GUIDE' });
      }
      
      await loadGuides(); // Refresh guides list
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return false;
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value = {
    ...state,
    loadGuides,
    loadGuide,
    createNewGuide,
    updateCurrentGuide,
    saveCurrentGuide,
    deleteGuide,
    clearError
  };

  return (
    <GuideContext.Provider value={value}>
      {children}
    </GuideContext.Provider>
  );
}

export const useGuide = () => {
  const context = useContext(GuideContext);
  if (!context) {
    throw new Error('useGuide must be used within a GuideProvider');
  }
  return context;
};
