import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

// The only way the app's hooks reach the store. Components don't use these: they call the hooks in
// src/hooks/, which hand them state and actions.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
