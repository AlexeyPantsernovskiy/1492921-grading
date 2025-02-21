export const SALT_ROUNDS = 10;

export const UserMessage = {
  EmailExists: 'Пользователь с таким email уже существует',
  UserNotFound: 'Пользователь не найден',
  PasswordWrong: 'Неверный пароль пользователя',
  UserLogout: 'Пользователю необходимо выйти из системы',
} as const;

export const UserProperty = {
  Id: {
    Description: {
      description: 'Идентификатор пользователя (ID)',
      example: '67947fc34444fac62a805fb8',
    },
  },
  Email: {
    Description: {
      description: 'Еmail пользователя',
      example: 'user@user.ru',
    },
    Validate: { Message: 'Некорректный email' },
  },
  Password: {
    Description: {
      description: 'Пароль пользователя',
      example: '123456',
    },
    Validate: {
      MinLength: 6,
      MaxLength: 12,
      Message: 'Длина пароля должна быть от 6 до 12 символов',
    },
  },
  Name: {
    Description: {
      description: 'Имя пользователя',
      example: 'Ivan Ivanov',
    },
    Validate: {
      MinLength: 1,
      MaxLength: 15,
      Message: 'Имя пользователя должно быть не более 15 символов',
    },
  },
  OldPassword: {
    Description: {
      description: 'Текущий пароль пользователя',
      example: '123456',
    },
  },
  NewPassword: {
    Description: {
      description: 'Новый пароль пользователя',
      example: '12345678',
    },
    Validate: {
      MinLength: 6,
      MaxLength: 12,
      Message: 'Длина пароля должна быть от 6 до 12 символов',
    },
  },
  AccessToken: {
    Description: {
      description: 'Access токен пользователя',
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Nzk0N2ZjMzQ0NDRmYWM2MmE4MDVmYjgiLCJlbWFpbCI6IkFJQG5tYWlsLnJ1IiwibmFtZSI6IkFsZXhleSBJdmFub3YiLCJpYXQiOjE3Mzc4OTQ2MTIsImV4cCI6MTczNzg5NDkxMn0.oU8NF3Rsub-Y-77FNhmcsg1mhkRoneSSl5wO6siUy6g',
    },
  },
  RefreshToken: {
    Description: {
      description: 'Refresh токен пользователя',
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Nzk0N2ZjMzQ0NDRmYWM2MmE4MDVmYjgiLCJlbWFpbCI6IkFJQG5tYWlsLnJ1IiwibmFtZSI6IkFsZXhleSBJdmFub3YiLCJ0b2tlbklkIjoiZjQ4ZmI4MjUtYjhiMy00MjMyLWI3NDUtYmNmNjcyMmY4MWYyIiwiaWF0IjoxNzM3ODk0NTYzLCJleHAiOjE3NDA0ODY1NjN9.EnQNpCY0UBWRblDb9DXfN5q-VDTQHOt8_xrHLihQyfk',
    },
  },
} as const;

export const UserParam = {
  UserId: {
    name: 'userId',
    type: String,
    schema: UserProperty.Id,
  },
} as const;

export const UserOperation = {
  Register: { summary: 'Регистрация нового пользователя' },
  ChangePassword: { summary: 'Изменение пароля пользователя' },
  Login: { summary: 'Авторизация пользователя' },
  GetUser: { summary: 'Получение информации о пользователе' },
  RefreshTokens: { summary: 'Обновление токенов' },
  Check: { summary: 'Проверка access токена' },
} as const;
