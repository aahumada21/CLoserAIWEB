# Reglas de permisos de Claude Code en este proyecto

Este documento explica qué comandos están permitidos sin confirmación (`.claude/settings.json`) y por qué, para que el criterio se mantenga consistente cuando se agreguen nuevas reglas.

## Reglas activas

| Patrón | Motivo |
|---|---|
| `Bash(timeout 20 npm run build)` | Build de verificación, no muta el repo ni el servidor |
| `Bash(git -C /c/Dev/CloserWEB remote -v)` | Lectura de remotes |
| `Bash(git -C /c/Dev/CloserWEB log --oneline -5)` | Lectura de historial |
| `Bash(git -C /c/Dev/CloserWEB status*)` | Lectura de estado del repo |
| `Bash(git -C /c/Dev/CloserWEB log*)` | Lectura de historial (cualquier variante) |

Nota: usamos `git -C /c/Dev/CloserWEB <subcomando>` explícito (en vez de depender del cwd), por lo que estas invocaciones no calzan con el auto-allow genérico de Claude Code para `git status` / `git log` y necesitan su propia regla.

## Criterio para agregar nuevas reglas

1. **Solo lectura.** El comando no debe escribir, borrar, renombrar, hacer push/merge, instalar paquetes, ni reiniciar procesos.
2. **Nunca ejecución de código arbitrario.** No se permiten wildcards sobre:
   - Intérpretes: `node`, `python`, `npx`, etc.
   - Shells / acceso remoto: `bash`, `sh`, `ssh`, `eval`, `exec`.
   - Task runners genéricos: `npm run *`, `make *`.

   Esto aplica en especial a `ssh vps` y `ssh deploy@...`: aunque se usan seguido para operar la VPS, permitir ese patrón en wildcard equivale a darle a Claude control total sobre el servidor sin pedir confirmación. Por eso cada comando SSH a la VPS se sigue confirmando uno por uno.
3. **Repetición real.** Solo se agregan patrones que aparecieron 3+ veces en el uso real (revisado en transcripts de `~/.claude/projects/`), no por anticipación.
4. **Patrón más angosto posible.** Si un subcomando tiene variantes que mutan (ej. `git remote -v` lee, pero `git remote add` escribe), no se usa wildcard sobre la base (`remote*`) — se deja el exacto que es de solo lectura.

## Comandos explícitamente excluidos (y por qué)

| Comando | Por qué no se permite en wildcard |
|---|---|
| `ssh vps`, `ssh deploy@...` | Acceso remoto arbitrario a la VPS de producción |
| `ssh-keygen` | Genera/sobreescribe archivos de llaves |
| `curl` | Puede usarse para GET o para mutar (POST/PUT/DELETE) según el comando |
| `node`, `npx` | Ejecución de código arbitrario |
| `psql` | Acceso a base de datos, puede mutar datos |
| `rm` | Destructivo |
| `pm2 start/restart/delete` | Reinicia/mata procesos en producción |
| `git push`, `git add`, `git commit` | Mutan el repo / remoto |

Cuando haya duda sobre si un comando es seguro de automatizar, se deja fuera del allowlist y se sigue pidiendo confirmación manual.
