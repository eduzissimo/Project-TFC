import mapStatusHTTP from './mapStatusHTTP';

const { NOT_FOUND, UNPROCESSABLE_ENTITY, UNAUTHORIZED } = mapStatusHTTP;

export const invalidTeamRes = {
  status: NOT_FOUND,
  data: { message: 'There is no team with such id!' },
};

export const invalidMatchRes = {
  status: UNPROCESSABLE_ENTITY,
  data: { message: 'It is not possible to create a match with two equal teams' },
};

export const invalidCredentialsRes = {
  status: UNAUTHORIZED,
  data: { message: 'Invalid email or password' },
};
