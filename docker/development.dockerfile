# Utilise l'image de base Crystal
FROM crystallang/crystal:1.15.0

# Installe les utilitaires requis
RUN apt-get update && \
    apt-get install -y wget curl unzip # Ajout de curl et unzip pour l'installation de Bun

# Installe les dépendances Apt :
# - Les outils CLI Postgres sont requis pour lucky-cli.
# - tmux est requis pour le gestionnaire de processus Overmind.
RUN apt-get update && \
    apt-get install -y postgresql-client tmux && \
    rm -rf /var/lib/apt/lists/*

# Installe Bun.sh
# Le script d'installation de Bun est exécuté, et le répertoire bin de Bun est ajouté au PATH.
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"
RUN curl -fsSL https://bun.sh/install | bash

# Installe lucky cli
WORKDIR /lucky/cli
RUN git clone https://github.com/luckyframework/lucky_cli . && \
    git checkout v1.3.0 && \
    shards build --without-development && \
    cp bin/lucky /usr/bin

# Définit le répertoire de travail pour l'application
WORKDIR /app

# Définit la variable d'environnement pour l'URL de la base de données
# Note : Cette variable sera probablement surchargée par Docker Compose,
# mais il est bon d'avoir une valeur par défaut.
ENV DATABASE_URL=postgres://postgres:postgres@host.docker.internal:5432/postgres

# Expose les ports nécessaires
EXPOSE 3000
EXPOSE 3001

# Note : L'ENTRYPOINT et le CMD sont généralement définis dans Docker Compose
# ou laissés pour que l'image soit plus flexible.
# Si votre dev_entrypoint.sh s'attend à ce que Bun soit disponible,
# cette configuration devrait fonctionner.
