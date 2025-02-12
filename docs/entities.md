# Rahat Entities

This document outlines the use of database schemas: **Beneficiary**, **Vendor**, **User**, and **Project**. Each schema is described with its purpose as follows.

---

## 1. Beneficiary

### Introduction

The **Beneficiary** schema is used to represent individuals who receive benefits from a program or service. This schema is essential for tracking personal details, eligibility, and associated data for reporting and operational needs.

### Basic Structure

The schema contains fields such as name, email, phone, and government ID. It also includes a reference to the project the beneficiary is associated with, ensuring the relationship between beneficiaries and projects is well-defined.

### How they Connect

- Each beneficiary is linked to a specific project.
- This connection enables the organization to manage beneficiaries by project.

---

## 2. Vendor

### Intoduction

The **Vendor** schema represents external entities providing goods or services to beneficiaries for specific projects. Managing vendor details, contracts, and transactions is crucial for operational efficiency.

### Basic Structure

The schema includes fields for vendor name, contact information, and address. It also links to the project being served, allowing for streamlined tracking of vendor-project relationships.

### How they Connect

- Vendors are associated with projects they contribute to.
- This linkage ensures transparency in the allocation of resources and services provided by vendors.

---

## 3. User

### Introduction

The **User** schema represents individuals interacting with the system, such as administrators or project managers. This schema facilitates role-based access control and activity tracking within the organization.

### Basic Structure

It includes user details like name, email, and role (e.g., Admin, Manager). This schema helps define the roles and responsibilities of users within the system.

### How they Connect

- Users oversee multiple projects and interact with other entities such as beneficiaries and vendors.
- The schema supports role-based permissions, ensuring appropriate access to system functionalities.

---

## 4. Project

### Introduction

The **Project** schema is central to the system, representing initiatives or programs managed by the organization. It serves as the backbone connecting beneficiaries, vendors, and users under a single framework.

### Basic Structure

It includes details about the project, such as name, description, start and end dates, and the user who created it.

### How they Connect

- Projects are linked to beneficiaries, vendors, and users.
- These connections create a unified structure, enabling seamless tracking of resources, operations, and stakeholders involved in each project.

---

## Relationships Overview

1. **Beneficiary** → Linked to a specific project.
2. **Vendor** → Associated with projects they serve.
3. **User** → Oversees projects and interacts with related entities.
4. **Project** → Central schema connecting beneficiaries, vendors, and users.

---
