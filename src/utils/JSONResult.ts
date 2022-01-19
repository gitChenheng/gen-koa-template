export default {
  ok: (data?, msg?) => ({
    status: 200,
    body: {
      code: 1,
      data: data || null,
      msg: msg || 'ok',
    }
  }),
  err: (data?, msg?) => ({
    status: 400,
    body: {
      code: 2,
      data: data || null,
      msg: msg || 'unknown err'
    }
  }),
  unauthorized: (msg?: string) => ({
    status: 200,
    body: {
      code: 4,
      msg: msg || "Unauthorized to access!",
    },
  }),
  build: ({status, body}) => ({
    status,
    body,
  })
}
