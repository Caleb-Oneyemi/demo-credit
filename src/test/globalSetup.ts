const EnvVars = {
  JWT_SECRET: 'JWT_SECRET',
}

const globalSetup = async () => {
  for (const key in EnvVars) {
    process.env[key] = EnvVars[key as keyof typeof EnvVars]
  }
}

export default globalSetup
