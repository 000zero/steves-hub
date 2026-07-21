---
title: "Stripe Payment Integration"
type: "project"
company: "Hooray Agency"
tags: ["stripe", "payments", ".net core", "api"]
date_range: "2023 - Present"
---

## Overview

Built a Stripe API integration that allows applications to make payment
requests and log transactions to a database. The requirement was to 
make the request to our own server and then have the transaction made
to the Stripe API via our backend ASP.NET server API. I used the front
end Stripe library to generate a payment token for the payment info and
then that token was sent to the our API where it was used to connect 
with Stripe via API to validate the payment info and then process the
payment if the token is valid

## Problem it solves

The websites in question had old code for Stripe that was no longer 
functional (stripes api's were changed), so we needed to update the
code in order to process payments for the yearly events.

## Your specific role

I architected and designed the API that included the transaction logging,
schema, handle webhooks for payment processing and status updates

## Tech stack

.NET Core, Stripe API, SQL Server (transaction logging)

## Links

The API is internal and only accessible inside the AWS VPN
