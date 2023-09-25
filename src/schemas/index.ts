export const postBodySchema = {
    type: 'object',
    properties: {
      body: {
        type: 'object',
        required: ['title', 'text'],
        properties: {
            userId: {
                type: 'string',
                minLength: 1,
                maxLength: 50
                },
            title: {
                type: 'string',
                minLength: 1,
                maxLength: 50
            },
            text: {
                type: 'string',
                minLength: 0,
                maxLength: 300
            }
        }
      }
    }
}

export const editBodySchema = {
    type: 'object',
    properties: {
      body: {
        type: 'object',
        required: ['title', 'text', 'userId', 'noteId'],
        properties: {
            userId: {
                type: 'string',
                minLength: 1,
                maxLength: 50
                },
            noteId: {
                type: 'string',
                minLength: 10,
                maxLength: 20
            },
            title: {
                type: 'string',
                minLength: 1,
                maxLength: 50
            },
            text: {
                type: 'string',
                minLength: 0,
                maxLength: 300
            }
        }
      }
    }
}

export const deleteBodySchema = {
    type: 'object',
    properties: {
      body: {
        type: 'object',
        required: ['userId', 'noteId'],
        properties: {
            userId: {
                type: 'string',
                minLength: 1,
                maxLength: 50
                },
            noteId: {
                type: 'string',
                minLength: 10,
                maxLength: 20
            }
        }
      }
    }
}

export const loginBodySchema = {
    type: 'object',
    properties: {
      body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
            username: {
                type: 'string',
                minLength: 1,
                maxLength: 50
                },
            password: {
                type: 'string',
                minLength: 1,
                maxLength: 40
            }
        }
      }
    }
}

export const signupBodySchema = {
    type: 'object',
    properties: {
      body: {
        type: 'object',
        required: ['username', 'password', 'email'],
        properties: {
            username: {
                type: 'string',
                minLength: 1,
                maxLength: 50
            },
            password: {
                type: 'string',
                minLength: 1,
                maxLength: 40
            },
            email: {
                type: 'string',
                minLength: 5,
                maxLength: 50
            }
        }
      }
    }
}
