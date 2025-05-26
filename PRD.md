# DomusAI : Personal CRM on steroids

Product Specifications for DomusAI

## Overview

AI first centralized platform for household and their members to manage their daily chores including financial tracking, scheduling, and resource planning. Think of it as a personal CRM for your household on steroids.

## MVP Features

- [ ] User Management
  - [ ] Basic email/password authentication
  - [ ] Household group creation
  - [ ] Role-based access control (Admin/Member)

- [ ] Financial Tracking
  - [ ] Manual expense/income entry
  - [ ] Automatic expense/income entry from bank statements, apis and other data sources
  - [ ] Category system (Food, Bills, Healthcare)
  - [ ] Monthly budget thresholds
  - [ ] Basic cash flow reports
  - [ ] AI Analytics, Insights and Recommendations

- [ ] Calendar & Scheduling
  - [ ] Shared family calendar
  - [ ] Medical/appointment tracking
  - [ ] Event Tracking
  - [ ] SMS/email reminders (24h prior)

- [ ] Grocery Management
  - [ ] Pantry inventory
    - [ ] Manual and Automated price tracking
  - [ ] Grocery Shopping
  - [ ] Meal planning w/ AI recommendations

- [ ] Smart Home
  - [ ] Home Assistant/Smart Devices
  - [ ] Home Automation w/ Home Assistant
  - [ ] Home Security System w/ Home Assistant
  - [ ] AI Voice Assistant w/ Home Assistant

- [ ] Health Management
  - [ ] Medicine management and reminders integration with hospital and pharmacy apps
  - [ ] Test results managemend and tracking and integration with hospital apps
  - [ ] Health data tracking and integration with health apps
  - [ ] Followups and appointments integration with hospital apps
  - [ ] Workout tracking and integration with speediance gym monster and other sytems like that

- [ ] Facilities and Utilities
  - [ ] Electricity usage and bill tracking
  - [ ] Water usage and bill tracking
  - [ ] Gas usage and bill tracking
  - [ ] Internet usage and bill tracking
  - [ ] Home Insurance tracking
  - [ ] Home Maintenance tracking
  - [ ] Laundry reminders

- [ ] Auto, Garage & Gym management
  - [ ] Auto insurance tracking
  - [ ] Auto maintenance tracking
  - [ ] Garage management

## Technical Stack
- **Backend**: gRPC with Envoy Proxy
- **App**: React/Vite with grpc-web and tailwindcss
- **Database**: PostgreSQL
- **Infra**: Containers/Docker

## Future Roadmap
- [ ] Document storage
- [ ] Mobile clients
