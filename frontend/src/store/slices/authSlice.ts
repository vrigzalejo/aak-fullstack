import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

// Logging utility
const log = {
    info: (message: string, data?: any) => {
        console.info(`[AUTH] ${message}`, data ? data : '')
    },
    success: (message: string, data?: any) => {
        console.log(`[AUTH] SUCCESS: ${message}`, data ? data : '')
    },
    error: (message: string, data?: any) => {
        console.error(`[AUTH] ERROR: ${message}`, data ? data : '')
    },
    warning: (message: string, data?: any) => {
        console.warn(`[AUTH] WARNING: ${message}`, data ? data : '')
    }
}

interface User {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    date_joined: string
}

interface SignupData {
    username: string
    email: string
    first_name: string
    last_name: string
    password: string
    password_confirm: string
}

interface AuthState {
    user: User | null
    loading: boolean
    error: string | null
    success: boolean
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    success: false
}

// Async thunk for user signup
export const signupUser = createAsyncThunk(
    'auth/signup',
    async (userData: SignupData, { rejectWithValue }) => {
        try {
            log.info('Starting signup request', { username: userData.username, email: userData.email })

            // Temporarily use direct API call to bypass proxy issues
            const apiUrl = 'http://localhost:8000/api/auth/signup'

            const response = await axios.post(apiUrl, userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            log.success('Signup request successful', { 
                status: response.status,
                userId: response.data.user?.id,
                username: response.data.user?.username
            })

            return response.data
        } catch (error: any) {
            log.error('Signup request failed', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                errorData: error.response?.data
            })

            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data)
            }
            
            return rejectWithValue({ message: 'Network error occurred' })
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            log.info('Clearing error state')
            state.error = null
        },
        clearSuccess: (state) => {
            log.info('Clearing success state')
            state.success = false
        },
        resetAuthState: (state) => {
            log.info('Resettings auth state')
            state.user = null
            state.loading = false
            state.error = null
            state.success = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.pending, (state) => {
                log.info('Signup pending - setting loading state')
                state.loading = true
                state.error = null
                state.success = false
            })
            .addCase(signupUser.fulfilled, (state, action: PayloadAction<any>) => {
                log.success('Signup fulfilled - user created successfully', {
                    userId: action.payload.user?.id,
                    username: action.payload.user?.username
                })
                state.loading = false
                state.success = true
                state.user = action.payload.user
                state.error = null
            })
            .addCase(signupUser.rejected, (state, action: PayloadAction<any>) => {
                log.error('Signup rejected - handling error', {
                    error: action.payload?.message || 'Signup failed',
                    payload: action.payload
                })
                state.loading = false

                // Handle different types of errors
                if (action.payload && typeof action.payload === 'object') {
                    // If it's a validation error with field-specific errors
                    if (action.payload.errors) {
                        state.error = action.payload
                    } else if (action.payload.message) {
                        state.error = action.payload.message
                    } else {
                        state.error = 'Signup failed'
                    }
                } else if (typeof action.payload === 'string') {
                    state.error = action.payload
                } else {
                    state.error = 'Signup failed'
                }

                state.success = false
            })
    },
})

export const { clearError, clearSuccess, resetAuthState } = authSlice.actions
export default authSlice.reducer
