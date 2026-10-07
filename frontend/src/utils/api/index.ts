import { UserAccount, User, Transaction, Card } from '../../types';

const myInit = (method = 'GET', token?: string) => {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    mode: 'cors' as RequestMode,
    cache: 'default' as RequestCache,
  };
};

const myRequest = (endpoint: string, method: string, token?: string) =>
    new Request(endpoint, myInit(method, token));

// Apunta directamente a tu API Gateway Spring Boot
const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const rejectPromise = (response?: Response): Promise<Response> =>
    Promise.reject({
      status: (response && response.status) || '00',
      statusText: (response && response.statusText) || 'Ocurrió un error',
      err: true,
    });

// --- AUTENTICACIÓN Y REGISTRO ---

export const login = (email: string, password: string) => {
  return fetch(myRequest(`${baseUrl}/api/auth/login`, 'POST'), {
    body: JSON.stringify({ email, password }),
  })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return rejectPromise(response);
      })
      .catch((err) => {
        console.log(err);
        return rejectPromise(err);
      });
};

export const createAnUser = (user: User) => {
  return fetch(myRequest(`${baseUrl}/api/users/register`, 'POST'), {
    body: JSON.stringify(user),
  })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return rejectPromise(response);
      })
      // El backend genera automáticamente la cuenta al registrarse
      .catch((err) => {
        console.log(err);
        return rejectPromise(err);
      });
};

// --- USUARIOS ---

export const getUser = (id: string): Promise<User> => {
  return fetch(myRequest(`${baseUrl}/api/users/${id}`, 'GET'))
      .then((response) =>
          response.ok ? response.json() : rejectPromise(response)
      )
      .catch((err) => {
        console.log(err);
        return rejectPromise(err);
      });
};

export const updateUser = (
    id: string,
    data: any,
    token: string
): Promise<Response> => {
  return fetch(myRequest(`${baseUrl}/api/users/${id}`, 'PATCH', token), {
    body: JSON.stringify(data),
  })
      .then((response) =>
          response.ok ? response.json() : rejectPromise(response)
      )
      .catch((err) => {
        console.log(err);
        return rejectPromise(err);
      });
};

// --- CUENTAS (ACCOUNT SERVICE) ---

export const getAccount = (id: string, token: string): Promise<UserAccount> => {
  return fetch(myRequest(`${baseUrl}/api/accounts/user/${id}`, 'GET', token))
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return rejectPromise(response);
      })
      .catch((err) => {
        console.log(err);
        return rejectPromise(err);
      });
};

export const getAccounts = (): Promise<UserAccount[]> => {
  return fetch(myRequest(`${baseUrl}/api/accounts`, 'GET'))
      .then((response) =>
          response.ok ? response.json() : rejectPromise(response)
      )
      .catch((err) => {
        console.log(err);
        return rejectPromise(err);
      });
};

export const updateAccount = (
    id: string,
    data: any,
    token: string
): Promise<Response> => {
  return fetch(myRequest(`${baseUrl}/api/accounts/${id}`, 'PATCH', token), {
    body: JSON.stringify(data),
  })
      .then((response) =>
          response.ok ? response.json() : rejectPromise(response)
      )
      .catch((err) => {
        console.log(err);
        return rejectPromise(err);
      });
};

// --- ACTIVIDADES Y TRANSACCIONES ---

export const getUserActivities = (
    userId: string,
    token: string,
    limit?: number
): Promise<Transaction[]> => {
  return fetch(
      myRequest(
          `${baseUrl}/api/accounts/user/${userId}/activity${limit ? `?limit=${limit}` : ''}`,
          'GET',
          token
      )
  )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return rejectPromise(response);
      })
      .catch((err) => {
        console.log(err);
        return rejectPromise(err);
      });
};

export const getUserActivity = (
    userId: string,
    activityId: string,
    token: string
): Promise<Transaction> => {
  return fetch(
      myRequest(
          `${baseUrl}/api/accounts/activity/${activityId}`,
          'GET',
          token
      )
  )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return rejectPromise(response);
      })
      .catch((err) => {
        console.log(err);
        return rejectPromise(err);
      });
};

export const createDepositActivity = (
    userId: string,
    amount: number,
    token: string
) => {
  const activity = {
    amount,
    type: 'Deposit',
    description: 'Depósito con tarjeta',
  };

  return fetch(
      myRequest(`${baseUrl}/api/accounts/user/${userId}/deposit`, 'POST', token),
      {
        body: JSON.stringify(activity),
      }
  )
      .then((response) =>
          response.ok ? response.json() : rejectPromise(response)
      )
      .catch((err) => {
        console.log(err);
        return rejectPromise(err);
      });
};

export const createTransferActivity = (
    userId: string,
    token: string,
    origin: string,
    destination: string,
    amount: number,
    name?: string
) => {
  return fetch(
      myRequest(`${baseUrl}/api/accounts/user/${userId}/transfers`, 'POST', token),
      {
        body: JSON.stringify({
          type: 'Transfer',
          amount: amount * -1,
          origin,
          destination,
          name,
        }),
      }
  )
      .then((response) =>
          response.ok ? response.json() : rejectPromise(response)
      )
      .catch((err) => {
        console.log(err);
        return rejectPromise(err);
      });
};

// --- TARJETAS ---

export const getUserCards = (
    userId: string,
    token: string
): Promise<Card[]> => {
  return fetch(myRequest(`${baseUrl}/api/accounts/user/${userId}/cards`, 'GET', token))
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return rejectPromise(response);
      })
      .catch((err) => {
        console.log(err);
        return rejectPromise(err);
      });
};

export const getUserCard = (userId: string, cardId: string, token: string): Promise<Card> => {
  return fetch(myRequest(`${baseUrl}/api/accounts/user/${userId}/cards/${cardId}`, 'GET', token))
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return rejectPromise(response);
      })
      .catch((err) => {
        console.log(err);
        return rejectPromise(err);
      });
};

export const deleteUserCard = (
    userId: string,
    cardId: string,
    token: string
): Promise<Response> => {
  return fetch(
      myRequest(`${baseUrl}/api/accounts/user/${userId}/cards/${cardId}`, 'DELETE', token)
  )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return rejectPromise(response);
      })
      .catch((err) => {
        console.log(err);
        return rejectPromise(err);
      });
};

export const createUserCard = (
    userId: string,
    card: any,
    token: string
): Promise<Response> => {
  return fetch(myRequest(`${baseUrl}/api/accounts/user/${userId}/cards`, 'POST', token), {
    body: JSON.stringify(card),
  })
      .then((response) =>
          response.ok ? response.json() : rejectPromise(response)
      )
      .catch((err) => {
        console.log(err);
        return rejectPromise(err);
      });
};