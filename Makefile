.PHONY: help build save load run update helm k8s clear

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "  build   docker build"
	@echo "  save    docker save to tarball"
	@echo "  load    k3s import from tarball"
	@echo "  run     build + save + load + Helm deploy"
	@echo "  update  build + save + load + rollout restart"
	@echo "  helm    Helm deploy only (no build)"
	@echo "  k8s     build + save + load + k8s manifest apply"
	@echo "  clear   remove tarball and docker image"

IMAGE := file-viewer
TARBALL := file-viewer.tar
HELM_CHART := ./helm/file-viewer
K8S_MANIFEST := ./k8s/file-viewer.local.yaml

build:
	sudo docker build -t $(IMAGE) .

save:
	sudo docker save $(IMAGE):latest > $(TARBALL)

load:
	sudo k3s ctr images import $(TARBALL)

run: build save load
	helm upgrade --install $(IMAGE) $(HELM_CHART) --reuse-values --force --wait

helm:
	helm upgrade --install $(IMAGE) $(HELM_CHART) --reuse-values --force --wait

update: build save load
	kubectl rollout restart deployment/$(IMAGE)
	kubectl rollout status deployment/$(IMAGE) --timeout=300s

k8s: build save load
	sudo kubectl delete -f $(K8S_MANIFEST) || true
	sudo kubectl apply -f $(K8S_MANIFEST)

clear:
	rm -f $(TARBALL)
	sudo docker rmi $(IMAGE):latest || true
