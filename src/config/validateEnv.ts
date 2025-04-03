interface EnvVar {
    key: string;
    validator?: (value: string) => boolean;
    errorMessage?: string;
}

const envConfig: EnvVar[] = [
    {
        key: 'NODE_ENV',
        validator: (value) => ['development', 'production', 'test'].includes(value),
        errorMessage: 'NODE_ENV must be either development, production, or test'
    },
    {
        key: 'DB_USER',
    },
    {
        key: 'DB_NAME',
    },
    {
        key: 'DB_PASSWORD',
    },
    {
        key: 'DB_HOST',
    },
    {
        key: 'APP_SECRET',
        validator: (value) => value.length >= 32,
        errorMessage: 'APP_SECRET must be at least 32 characters long'
    }
];

function validateEnv() {
    const errors: string[] = [];

    envConfig.forEach(({ key, validator, errorMessage }) => {
        const value = process.env[key];

        if (!value) {
            errors.push(`Missing required environment variable: ${key}`);
            return;
        }

        if (validator && !validator(value)) {
            errors.push(errorMessage || `Invalid value for ${key}`);
        }
    });

    if (errors.length > 0) {
        throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
    }
}

export default validateEnv;
