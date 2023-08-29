# Documentação do Kubernetes e Google Cloud Platform (GCP)

---

# Índice

- [Conceitos Básicos](#1-conceitos-básicos)
    - [Nó vs. Pod](#11-nó-vs-pod)
- [Organização dos Aplicativos](#2-organização-dos-aplicativos)
- [Pool de Nós (Node Pools)](#3-pool-de-nós-node-pools)
- [Gerenciando o GCP pela Linha de Comando](#4-gerenciando-o-gcp-pela-linha-de-comando)
    - [Verificando o Status de Login](#41-verificando-o-status-de-login)
    - [Listando Projetos](#42-listando-projetos)
    - [Listando Recursos de um Projeto](#43-listando-recursos-de-um-projeto)
    - [Workloads](#44-workloads)
- [Usando kubectl](#5-usando-kubectl)
    - [Aplicando Configurações](#51-aplicando-configurações)
    - [Atualizando um Aplicativo](#52-atualizando-um-aplicativo)
    - [Skaffold](#53-skaffold)
- [Lens - Interface Gráfica para Kubernetes](#6-lens---interface-gráfica-para-kubernetes)
- [Arquivos de Deployment](#7-arquivos-de-deployment)
- [Verificando o Contexto Atual](#8-verificando-o-contexto-atual)

---

## 1. Conceitos Básicos

### 1.1 Nó vs. Pod

- **Nó (Node)**: Uma máquina física ou virtual que hospeda os containers. Os nós podem ser VMs, servidores físicos etc.
- **Pod**: A menor e mais simples unidade no modelo de objeto Kubernetes. Um Pod representa um processo em execução no cluster.

## 2. Organização dos Aplicativos

- É aconselhável agrupar aplicativos semelhantes ou relacionados em um único cluster e usar namespaces para separá-los, em vez de criar um cluster para cada aplicativo.

## 3. Pool de Nós (Node Pools)

- Um pool de nós é um subconjunto de máquinas dentro de um cluster que possuem configurações semelhantes.

## 4. Gerenciando o GCP pela Linha de Comando

### 4.1 Verificando o Status de Login

```bash
gcloud auth list
```

### 4.2 Listando Projetos

```bash
gcloud projects list
```

### 4.3 Listando Recursos de um Projeto

Embora não haja um único comando para listar todos os recursos, você pode usar comandos específicos para cada tipo de recurso.

### 4.4 Workloads

Workloads representam as aplicações que estão sendo executadas em seu cluster.

## 5. Usando kubectl

### 5.1 Aplicando Configurações

```bash
kubectl apply -f ./deployment.yaml
```

### 5.2 Atualizando um Aplicativo

1. Reconstrua a imagem Docker.
2. Publique a imagem no registro.
3. Atualize o Deployment para usar a nova imagem.

### 5.3 Skaffold

- Ferramenta que automatiza várias das etapas de desenvolvimento e implantação para Kubernetes.

## 6. Lens - Interface Gráfica para Kubernetes

- Ferramenta de código aberto para visualizar e gerenciar clusters Kubernetes.
- Para começar, instale o Lens, adicione seu cluster via `kubeconfig` e navegue pela interface.

## 7. Arquivos de Deployment

- Arquivos de deployment definem como os pods devem ser criados e gerenciados, mas não especificam detalhes sobre o cluster ou nós.

## 8. Verificando o Contexto Atual

Para descobrir o contexto atual:

```bash
kubectl config current-context
```

Para detalhes completos:

```bash
kubectl config view --minify
```

---

Espero que esta documentação em formato Markdown atenda às suas necessidades. Se você desejar mais detalhes, ajustes ou tiver outras informações para adicionar, por favor, me informe!