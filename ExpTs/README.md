# Intrução para execução

Caso rodando pela primeira vez:

1.
```
docker network create game-app-network
```

2.
```
docker run -d \
--name game-app-db \
--network game-app-network \
-p 3307:3306 \
-e MYSQL_ROOT_PASSWORD=senhasegura \
-e MYSQL_DATABASE=game \
-v game-app-volume:/var/lib/mysql \
mysql:latest
```

3.
```
docker run -d \
--name game-app-phpmyadmin \
--network game-app-network \
-e PMA_HOST=game-app-db \
-e PMA_PORT=3306 \
-e PMA_USER=root \
-e PMA_PASSWORD=senhasegura \
-p 8081:80 \
phpmyadmin/phpmyadmin
```

4.
```
npx prisma migrate dev
```

5.
```
npx prisma generate
```

Caso contrário, pule o passo 1 e rode ```docker start game-app-db``` e ```docker start game-app-phpmyadmin``` no lugar dos comandos dos passos 2 e 3, respectivamente.
Rode o passo 4 e 5 apenas se houve alterado as tabelas do prisma, incluindo na primeira vez rodando o trabalho.
