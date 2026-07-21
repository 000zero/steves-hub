---
title: "Website Management & Deployment Hub"
type: "project"
company: "Hooray Agency"
tags: [".net core", "blazor", "devops", "api integration"]
date_range: "2023 - Present"
---

## Overview

A centralized internal tool built in .NET Core Blazor that gives the team
a single UI for controlling client websites end-to-end, instead of
jumping between five or six separate vendor dashboards. The site was 
secured using ASP.NET Identity for authentication and role based 
permissions.

## What it integrates

- Cloudflare (DNS / CDN management)
- Monday.com (project and task data, via GraphQL)
- WordPress (site content and management)
- GitLab (source control and pipeline status)
- AWS CodePipeline (deployment status and triggers)

## Problem it solves

Website information was only stored in a simple CMS application which 
only tracked the production and dev domains of the site with no other 
information. Deployments were done manually by a developer using git and
remote desktop to get onto the server and pull the update. The new site
tracks all information required to do the following 

- Check SSL certificate status periodically with a Hangfire based job
- Review GIT diffs on the website and approve
- Trigger deployments of new code from the website without having to 
  use git or RDP manually
- Get installed WordPress Plugins, using the WP API of the WordPress site,
  this ran once a day in a Hangfire job
- Get latest WordPress plugin version from Wordpress.org API and compare to
  installed versions to notify when new plugin versions are available
- Monitored WPVulnerability DB via API and Hangfire job to check against
  our list of installed plugins to notify when a plugin our site uses has
  a vulnerability issue
- Connect to GitLab via API to get commit history
- Connect to deployment server to connect to local git in order to get diff
  string via LibGit2Sharp
- Dynamically update DNS in Cloudflare (via Cloudflare API) with a button
- Trigger AWS CodePipeline deployment via AWS SDK

All of these features allowed deployments to be faster and more reliable 
because the of the automation. It also helped save at least 10 hours of 
manual work during WordPress maintenance because the user did not have 
to get a list of all plugins for each site and do the plugin check 
themselves.
  

## Scale / impact

Reduced time for deployment significantly and allowed users to deploy from
one interface. Reduced time spent on WordPress sites plugin maintenance.

## Your specific role

I architected the entire site and infrastructure based on discussions with the
team members that would be using the site

## Tech stack

.NET Core, Blazor, REST APIs, GraphQL (Monday.com), Cloudflare API,
GitLab API, AWS CodePipeline API

## Links

This is was an internal tool that requires a current company email to access
