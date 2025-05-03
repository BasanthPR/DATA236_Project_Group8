#!/bin/bash

echo "Creating main service directories..."
mkdir -p auth-service customer-service driver-service ride-service billing-service admin-service shared k8s

echo "Setting up shared folders..."
mkdir -p shared/kafka shared/redis

echo "Creating subfolders for each service..."
for service in auth-service customer-service driver-service ride-service billing-service admin-service; do
  echo "Setting up $service structure..."
  mkdir -p $service/controllers $service/models $service/routes $service/middleware
done

echo "✅ All folders are set up!"
