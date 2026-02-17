## Vytronix

Aplicación Next.js con gestión de solicitudes de contacto, autenticación con JWT en cookie y panel de administración.

### Requisitos

- Node 18+ y npm
- Base de datos PostgreSQL (variable `DATABASE_URL`)

### Configuración

1) Copia el archivo `.env.example` a `.env.local` y completa los valores:

- `DATABASE_URL`: cadena de conexión a Postgres
- `JWT_SECRET`: cadena aleatoria larga (para firmar el JWT)
- (Opcional) `RESEND_API_KEY` y `MAIL_FROM` para envío de correo de recuperación
- (Opcional) `VYAUDIT_BASE_URL`, `BRIDGE_SHARED_SECRET` y `BRIDGE_ISSUER` para abrir VyAudit desde `/admin` con token seguro de admin`r`n- (Opcional) `VYAUDIT_ADMIN_ACCESS_KEY`, `VYAUDIT_CHECKOUT_SECRET` y `VYAUDIT_PRICE_CLP` para cobrar VyAudit por Mercado Pago y redirigir a enlace único

2) Instala dependencias e inicia en desarrollo:

```bash
npm install
npm run dev
```

3) (Opcional) Asegura columnas nuevas si tu DB es antigua:

```bash
npm run db:apply:message   # agrega columna message si falta
npm run db:apply:status    # agrega columna status si falta
npm run db:check           # inspecciona columnas/filas de ejemplo
```

4) (Opcional) Crea un usuario administrador inicial (idempotente):

```bash
npm run seed:admin
```

### Scripts

- `npm run dev` / `build` / `start`: ciclo de Next.js
- `npm run db:generate` / `db:migrate`: Drizzle Kit
- `npm run db:apply:message` / `db:apply:status`: migraciones utilitarias (compatibilidad)
- `npm run db:check`: verificación de esquema y muestra de datos
- `npm run seed:admin`: crea un admin usando variables `ADMIN_*`

---

Documentación base de Next.js a continuación.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

