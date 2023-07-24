export interface FormError {
  path: string
  message: string
}

export interface Form<T> {
  async validate(data?: any): T
}

export interface FormEvent {
  type: 'blur' // | 'change' | 'focus'
  path: string
}
