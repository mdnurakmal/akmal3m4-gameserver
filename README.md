Original repository
https://github.com/aaron5670/PokeMMO-Online-Realtime-Multiplayer-Game

Changes
- Created CI/CD to deploy build docker image and push to registry using cloud build


Instructions

```
export CLOUDSDK_PYTHON_SITEPACKAGES=1
git pull
```

```
gcloud beta builds submit --config cloudbuild-us.yaml .
gcloud beta builds submit --config cloudbuild-asia.yaml .

```

If there are existing resources , you need to import to terraform manually and try cloud build again


Turn on IAP

Notes
authorize artifiact registry
gcloud auth configure-docker asia-docker.pkg.dev


Check that /server/test links to /test

