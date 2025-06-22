import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'
import { signupUser, clearError, clearSuccess } from '../store/slices/authSlice'

// Logging utility for form interactions
const formLog = {
    info: (message: string, data?: any) => {
        console.info(`[FORM] ${message}`, data ? data : '')
    },
    success: (message: string, data?: any) => {
        console.log(`[FORM] SUCCESS: ${message}`, data ? data : '')
    },
    error: (message: string, data?: any) => {
        console.error(`[FORM] ERROR: ${message}`, data ? data : '')
    },
    warning: (message: string, data?: any) => {
        console.warn(`[FORM] WARNING: ${message}`, data ? data : '')
    }
}

interface FormData {
    username: string
    email: string
    first_name: string
    last_name: string
    password: string
    password_confirm: string
}

interface FormErrors {
    [key: string]: string | string[]
}

interface BackendError {
    message?: string
    errors?: {
        [key: string]: string[]
    }
}

const SignupForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { loading, error, success } = useSelector((state: RootState) => state.auth)
    
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        password_confirm: '',
    })
    const [formErrors, setFormErrors] = useState<FormErrors>({})
    const [backendErrors, setBackendErrors] = useState<FormErrors>({})

    useEffect(() => {
        formLog.info('SignupForm component mounted')
        // Clear errors and success when component mounts
        dispatch(clearError())
        dispatch(clearSuccess())
    }, [dispatch])

    useEffect(() => {
        if (success) {
            formLog.success('Signup successful - form state updated')
            setBackendErrors({})
            setFormErrors({})
        }
        if (error) {
            formLog.error('Signup error received', { error })
            handleBackendErrors(error)
        }
        if (loading) {
            formLog.info('Form submission in progress')
            setBackendErrors({})
        }
    }, [success, error, loading])

    const handleBackendErrors = (errorData: any) => {
        const backendErrs: FormErrors = {}

        if (typeof errorData === 'object' && errorData.errors) {
            // Handle Django validation errors
            Object.keys(errorData.errors).forEach(field => {
                const fieldErrors = errorData.errors[field]
                if (Array.isArray(fieldErrors)) {
                    backendErrs[field] = fieldErrors[0] // Show first error
                } else if (typeof fieldErrors === 'string') {
                    backendErrs[field] = fieldErrors
                }
            })
        }

        setBackendErrors(backendErrs)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        formLog.info(`Field change: ${name}`, { fieldLength: value.length })

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear field errors when user starts typing
        if (formErrors[name]) {
            formLog.info(`Clearing client errors for field: ${name}`)
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }

        if (backendErrors[name]) {
            formLog.info(`Clearing backend errors for field: ${name}`)
            setBackendErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = (): boolean => {
        formLog.info('Starting form validation')
        const errors: FormErrors = {}
        
        
        if (!formData.username.trim()) {
            errors.username = 'Username is required'
        } else if (formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters'
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email address is invalid'
        }

        if (!formData.first_name.trim()) {
            errors.first_name = 'First name is required'
        }

        if (!formData.last_name.trim()) {
            errors.last_name = 'Last name is required'
        }

        if (!formData.password) {
            errors.password = 'Password is required'
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters'
        }

        if (!formData.password_confirm) {
            errors.password_confirm = 'Password confirm your password'
        } else if (formData.password !== formData.password_confirm) {
            errors.password_confirm = 'Passwords do not match'
        }

        setFormErrors(errors)
        const isValid = Object.keys(errors).length === 0

        if (isValid) {
            formLog.success('Form validation passed')
        } else {
            formLog.warning('Form validation failed', {
                errorCount: Object.keys(errors).length,
                errorFields: Object.keys(errors)
            })
        }

        return isValid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        formLog.info('Form submission initiated', {
            username: formData.username,
            email: formData.email,
        })

        // Clear previous backend errors
        setBackendErrors({})

        if (!validateForm()) {
            formLog.error('Form submission blocked due to validation errors')
            return
        }

        formLog.info('Dispatching signup action')
        dispatch(signupUser(formData))
    }

    const resetForm = () => {
        formLog.info('Resetting form to initial state')
        setFormData({
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            password: '',
            password_confirm: '',
        })
        setFormErrors({})
        setBackendErrors({})
        dispatch(clearSuccess())
    }

    const getFieldError = (fieldName: string): string => {
        const backendError = backendErrors[fieldName]
        const formError = formErrors[fieldName]

        if (typeof backendError === 'string') return backendError
        if (Array.isArray(backendError) && backendError.length > 0) return backendError[0]
        if (typeof formError === 'string') return formError
        if (Array.isArray(formError) && formError.length > 0) return formError[0]

        return ''
    }

    const hasFieldError = (fieldName: string): boolean => {
        return !!(backendErrors[fieldName] || formErrors[fieldName])
    }

    return (
        <div className="signup-form">
            <h1 className="form-title">Sign Up</h1>

            {success && (
                <div className="success-message">
                    Account created successfully! Welcome aboard!
                    <button
                        onClick={resetForm}
                        style={{
                            marginLeft: '10px',
                            background: 'none',
                            border: 'none',
                            color: '#27ae60',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        Create another account
                    </button>
                </div>
            )}

            {error && typeof error === 'object' && (error as any).message && !(error as any).errors && (
                <div className="error-message" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    {(error as any).message}
                </div>
            )}

            {error && typeof error === 'string' && (
                <div className="error-message" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input 
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`form-input ${hasFieldError('username') ? 'error' : ''}`}
                        placeholder="Enter your username"
                    />
                    {getFieldError('username') && (
                        <div className="error-message">{getFieldError('username')}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input 
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        className={`form-input ${hasFieldError('email') ? 'error' : ''}`}
                        placeholder="Enter your email"
                    />
                    {getFieldError('email') && (
                        <div className="error-message">{getFieldError('email')}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="first_name" className="form-label">First Name</label>
                    <input 
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className={`form-input ${hasFieldError('first_name') ? 'error' : ''}`}
                        placeholder="Enter your first name"
                    />
                    {getFieldError('first_name') && (
                        <div className="error-message">{getFieldError('first_name')}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="last_name" className="form-label">Last Name</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className={`form-input ${hasFieldError('last_name') ? 'error' : ''}`}
                        placeholder="Enter your last name"
                    />
                    {getFieldError('last_name') && (
                        <div className="error-message">{getFieldError('last_name')}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input 
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`form-input ${hasFieldError('password') ? 'error' : ''}`}
                        placeholder="Enter your password"
                    />
                    {getFieldError('password') && (
                        <div className="error-message">{getFieldError('password')}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="password_confirm" className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        id="password_confirm"
                        name="password_confirm"
                        value={formData.password_confirm}
                        onChange={handleChange}
                        className={`form-input ${hasFieldError('password_confirm') ? 'error' : ''}`}
                        placeholder="Confirm your password"
                    />
                    {getFieldError('password_confirm') && (
                        <div className="error-message">{getFieldError('password_confirm')}</div>
                    )}
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                >
                    {loading ? <span className="loading"></span> : 'Sign Up'}
                </button>
            </form>
        </div>
    )
}

export default SignupForm
