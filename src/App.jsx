import { useState } from "react";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const QUESTIONS = [
  // ─── DOMAIN 1: Identities & Governance ───────────────────────────────
  {
    id: 1, domain: "Identities & Governance",
    question: "Which Azure AD role grants full control over Azure AD and all Microsoft services that use Azure AD identities?",
    options: ["User Administrator", "Global Administrator", "Privileged Role Administrator", "Security Administrator"],
    correct: 1,
    explanation: "Global Administrator has full control over Azure AD and all Microsoft 365/Azure services. It's the most powerful directory role."
  },
  {
    id: 2, domain: "Identities & Governance",
    question: "You need to allow a user to manage all resources in a subscription but NOT grant access to others. Which built-in role should you assign?",
    options: ["Owner", "Contributor", "Reader", "User Access Administrator"],
    correct: 1,
    explanation: "Contributor can create and manage all resources but cannot grant RBAC access to others. Owner includes the ability to assign roles."
  },
  {
    id: 3, domain: "Identities & Governance",
    question: "Your company has 15 Azure subscriptions. You need to apply a consistent set of policies across ALL subscriptions. What is the BEST approach?",
    options: ["Apply Azure Policy to each subscription individually", "Create a Management Group and apply policies at that level", "Use Azure Blueprints on each subscription", "Create a resource group spanning all subscriptions"],
    correct: 1,
    explanation: "Management Groups allow you to organize subscriptions hierarchically and apply policies, RBAC, and budgets at scale across multiple subscriptions."
  },
  {
    id: 4, domain: "Identities & Governance",
    question: "You want to block resource creation in any region other than East US and West Europe. Which Azure service enforces this?",
    options: ["RBAC Deny assignment", "Azure Policy with Deny effect", "Azure Blueprints", "Resource Locks"],
    correct: 1,
    explanation: "Azure Policy with the Deny effect prevents non-compliant resource creation. The built-in policy 'Allowed locations' restricts deployments to specified regions."
  },
  {
    id: 5, domain: "Identities & Governance",
    question: "A company needs to prevent accidental deletion of a critical production resource group. What should they configure?",
    options: ["Assign Reader role to all users", "Azure Policy with Audit effect", "Resource Lock of type CanNotDelete", "Enable soft delete on the resource group"],
    correct: 2,
    explanation: "CanNotDelete locks prevent deletion of a resource or resource group even by Owners. The resource can still be modified but not deleted."
  },
  {
    id: 6, domain: "Identities & Governance",
    question: "Which Azure AD feature allows MFA to be required ONLY when users sign in from outside the corporate network?",
    options: ["MFA Server", "Conditional Access", "Identity Protection", "Privileged Identity Management (PIM)"],
    correct: 1,
    explanation: "Conditional Access evaluates signals (location, device, user risk) and applies access controls like MFA only when conditions are met. Requires Azure AD Premium P1."
  },
  {
    id: 7, domain: "Identities & Governance",
    question: "A Contributor on a resource group reports they cannot see a resource, even though no explicit deny assignment exists. What else could cause this?",
    options: ["Contributor role doesn't include read permissions", "The resource is in a different subscription", "A Deny assignment at resource level overrides the Contributor role", "The resource was recently moved between resource groups"],
    correct: 2,
    explanation: "Deny assignments explicitly block access even when a permissive role (like Contributor) would otherwise allow it. They take precedence over allow roles."
  },
  {
    id: 8, domain: "Identities & Governance",
    question: "RBAC role assignments in Azure are inherited from _______ to _______ scopes.",
    options: ["Resource → Resource Group → Subscription → Management Group", "Management Group → Subscription → Resource Group → Resource", "Subscription → Management Group → Resource Group → Resource", "Resource Group → Resource → Subscription → Management Group"],
    correct: 1,
    explanation: "RBAC assignments are inherited downward: Management Group → Subscription → Resource Group → Resource. A role assigned at a higher scope propagates to all child scopes."
  },
  {
    id: 9, domain: "Identities & Governance",
    question: "What is the purpose of Azure AD Privileged Identity Management (PIM)?",
    options: ["Permanently assign admin roles to reduce ticket overhead", "Provide just-in-time privileged access with approval workflows and time limits", "Synchronize on-premises AD groups with Azure AD", "Audit all login activity and generate compliance reports"],
    correct: 1,
    explanation: "PIM provides time-limited, just-in-time privileged access to Azure AD and Azure resources, with optional approval workflows, reducing standing privilege exposure."
  },
  {
    id: 10, domain: "Identities & Governance",
    question: "Which Azure Policy effect AUTOMATICALLY adds a tag to resources that are missing it, without blocking the deployment?",
    options: ["Deny", "Audit", "Append", "Modify"],
    correct: 3,
    explanation: "Modify effect can add, update, or remove tags on resources during creation or update, without blocking the operation. Append adds properties but cannot modify existing ones."
  },
  {
    id: 11, domain: "Identities & Governance",
    question: "Which Azure AD license tier is the MINIMUM required to use Conditional Access policies?",
    options: ["Azure AD Free", "Azure AD Premium P1", "Azure AD Premium P2", "Microsoft 365 Business Basic"],
    correct: 1,
    explanation: "Conditional Access policies require Azure AD Premium P1 at minimum. P2 adds Identity Protection-based conditions (user/sign-in risk)."
  },
  {
    id: 12, domain: "Identities & Governance",
    question: "You apply a ReadOnly resource lock to a storage account. What is the effect?",
    options: ["Users cannot read data stored in the account", "Users cannot write blobs but can read them", "Users cannot modify the storage account's configuration (e.g., SKU, replication)", "Users cannot delete blobs within the account"],
    correct: 2,
    explanation: "ReadOnly locks prevent changes to the resource's configuration (control plane). Data plane operations (reading/writing blobs) are not directly affected by the lock type."
  },
  {
    id: 13, domain: "Identities & Governance",
    question: "An Azure Policy assignment shows resources are 'Non-compliant'. The policy effect is 'Audit'. What happens to those resources?",
    options: ["They are deleted immediately", "They are flagged in the compliance report but NOT modified or blocked", "A remediation task runs automatically", "They are moved to a quarantine resource group"],
    correct: 1,
    explanation: "The Audit effect only logs non-compliant resources in the Azure Policy compliance dashboard. It does not block, modify, or delete resources."
  },
  {
    id: 14, domain: "Identities & Governance",
    question: "You need to grant a user access to create and manage VMs in a specific resource group only. What is the MINIMUM scope for the role assignment?",
    options: ["Management Group", "Subscription", "Resource Group", "Individual VM resources"],
    correct: 2,
    explanation: "Assigning the Contributor (or custom) role at the resource group scope limits the user's access to only that resource group, following the principle of least privilege."
  },
  {
    id: 15, domain: "Identities & Governance",
    question: "What is an Azure Blueprint used for?",
    options: ["Monitor resource health across subscriptions", "Package RBAC, policies, resource groups, and ARM templates into a reusable definition for consistent environment setup", "Enforce tag policies across management groups", "Provide cost allocation reports across subscriptions"],
    correct: 1,
    explanation: "Azure Blueprints package governance artifacts (policies, RBAC, ARM templates, resource groups) into a single definition that can be applied repeatedly to create compliant environments."
  },
  // ─── DOMAIN 2: Storage ───────────────────────────────────────────────
  {
    id: 16, domain: "Storage",
    question: "You need to store millions of images accessible via HTTP/HTTPS for a web application. Which Azure Storage service is MOST appropriate?",
    options: ["Azure Files", "Azure Table Storage", "Azure Blob Storage", "Azure Queue Storage"],
    correct: 2,
    explanation: "Azure Blob Storage is designed for unstructured data (images, videos, documents) and natively exposes HTTP/HTTPS endpoints. It's the de facto choice for web-accessible object storage."
  },
  {
    id: 17, domain: "Storage",
    question: "What is the key difference between LRS and ZRS replication?",
    options: ["LRS replicates to 3 availability zones; ZRS replicates to a paired region", "LRS replicates 3 copies within a single datacenter; ZRS replicates across 3 availability zones in the same region", "LRS is cheaper and less durable than ZRS", "ZRS is only available for premium storage accounts"],
    correct: 1,
    explanation: "LRS keeps 3 copies within one datacenter. ZRS replicates across 3 separate availability zones in the same region, protecting against single-datacenter failures while staying in-region."
  },
  {
    id: 18, domain: "Storage",
    question: "A third-party app needs to upload files to a blob container for exactly 48 hours without exposing your storage account key. What should you use?",
    options: ["Storage Account Key rotated after 48 hours", "Shared Access Signature (SAS) token with 48-hour expiry", "Azure AD token with a Contributor role", "Access Control List (ACL) with time limit"],
    correct: 1,
    explanation: "SAS tokens provide time-limited, permission-scoped access to storage resources. They can be restricted to specific operations, containers, and time windows without exposing account keys."
  },
  {
    id: 19, domain: "Storage",
    question: "Which blob storage access tier is MOST cost-effective for data that is accessed once per year and stored for at least 180 days?",
    options: ["Hot", "Cool", "Cold", "Archive"],
    correct: 3,
    explanation: "Archive tier has the lowest storage cost but the highest access cost and latency (data must be rehydrated, taking hours). It's designed for rarely accessed data kept long-term."
  },
  {
    id: 20, domain: "Storage",
    question: "You need to mount a file share simultaneously on a Windows Server VM and a Linux VM. Which Azure service supports this?",
    options: ["Azure Blob Storage (NFS)", "Azure Files with SMB and NFS protocol support", "Azure Disk Storage with shared disk enabled", "Azure Table Storage"],
    correct: 1,
    explanation: "Azure Files supports both SMB (Windows) and NFS (Linux) protocols, enabling simultaneous mounting on different OS types. Azure Disks with shared disk are limited to specific use cases."
  },
  {
    id: 21, domain: "Storage",
    question: "Soft delete is enabled on a storage account with a 14-day retention period. A blob is accidentally deleted. What is TRUE?",
    options: ["The blob is permanently deleted after 24 hours", "The blob can be restored within 14 days from the Azure portal or API", "The blob is automatically moved to the Archive tier", "The blob must be recovered from Azure Backup"],
    correct: 1,
    explanation: "Blob soft delete retains deleted blobs in a soft-deleted state for the retention period. They can be undeleted via the portal, CLI, or API within that window."
  },
  {
    id: 22, domain: "Storage",
    question: "Which storage account type is required to enable Azure Data Lake Storage Gen2 (hierarchical namespace)?",
    options: ["BlobStorage account", "General-purpose v1 (GPv1)", "General-purpose v2 (GPv2) with hierarchical namespace enabled", "Premium FileStorage"],
    correct: 2,
    explanation: "ADLS Gen2 is built on GPv2 accounts. Enabling the hierarchical namespace during account creation adds directory and file-level POSIX ACLs on top of Blob Storage."
  },
  {
    id: 23, domain: "Storage",
    question: "Your company needs to migrate 200 TB of data from on-premises to Azure Blob Storage. The internet link is 100 Mbps shared. What is the BEST migration approach?",
    options: ["AzCopy over the internet link", "Azure Data Factory with on-premises integration runtime", "Azure Data Box (physical device)", "Azure Storage Explorer with parallel transfers"],
    correct: 2,
    explanation: "200 TB over 100 Mbps would take weeks. Azure Data Box ships a physical appliance (80 TB capacity) to your location. You load data locally and ship it back to Microsoft for upload, bypassing network limitations."
  },
  {
    id: 24, domain: "Storage",
    question: "What is the purpose of Azure Storage lifecycle management policies?",
    options: ["Replicate blobs between storage accounts automatically", "Automatically transition blobs between access tiers or delete them after specified days", "Monitor storage account performance metrics", "Enable geo-redundant replication on a schedule"],
    correct: 1,
    explanation: "Lifecycle policies automate tier transitions (Hot → Cool → Archive) and deletion based on blob age, last modified date, or last accessed date, optimizing storage costs."
  },
  {
    id: 25, domain: "Storage",
    question: "A storage account has a firewall configured to deny all public access. An Azure VM in the same VNet cannot access the storage account. What is the correct fix?",
    options: ["Disable the storage account firewall entirely", "Add the VM's public IP to the firewall allowlist", "Add the VM's subnet to the storage account's allowed virtual networks", "Create a VPN Gateway between the VM's VNet and the storage account"],
    correct: 2,
    explanation: "Storage firewall 'service endpoints' or 'private endpoints' allow access from specific VNets/subnets. Adding the subnet to the allowed list enables private access without exposing a public IP."
  },
  {
    id: 26, domain: "Storage",
    question: "Which redundancy option protects against a complete Azure regional outage by replicating to a paired region AND across zones?",
    options: ["ZRS", "GRS", "GZRS", "LRS"],
    correct: 2,
    explanation: "GZRS (Geo-Zone-Redundant Storage) combines ZRS (3 zones in primary region) with GRS (replication to a secondary paired region), providing the highest durability."
  },
  {
    id: 27, domain: "Storage",
    question: "A storage account key was accidentally committed to a public GitHub repository. What is the IMMEDIATE action to take?",
    options: ["Delete the storage account and create a new one", "Rotate (regenerate) the compromised storage account key immediately", "Enable firewall rules to block all public access", "Change the storage account's replication type"],
    correct: 1,
    explanation: "Immediately rotate the compromised key to invalidate it. Azure storage accounts have two keys (key1 and key2) so you can rotate one while updating applications to use the other."
  },
  {
    id: 28, domain: "Storage",
    question: "Which Azure tool allows you to transfer data to/from Azure Blob Storage from the command line with high performance and support for AzCopy job resumption?",
    options: ["Azure Storage Explorer", "AzCopy", "Azure CLI az storage blob copy", "Azure Data Factory"],
    correct: 1,
    explanation: "AzCopy is a command-line utility optimized for Azure Storage transfers with support for parallel transfers, job journaling (resume), and SAS tokens."
  },
  // ─── DOMAIN 3: Compute ───────────────────────────────────────────────
  {
    id: 29, domain: "Compute",
    question: "You deploy two VMs that must remain available during planned Azure maintenance. What should you configure?",
    options: ["Availability Zone", "Availability Set", "Azure Site Recovery", "VM Scale Set"],
    correct: 1,
    explanation: "Availability Sets distribute VMs across up to 3 fault domains and 20 update domains, ensuring at least one VM stays available during planned and unplanned outages."
  },
  {
    id: 30, domain: "Compute",
    question: "What is the key FUNCTIONAL difference between VM Scale Sets (VMSS) and Availability Sets?",
    options: ["VMSS supports autoscaling; Availability Sets provide high availability only", "Availability Sets support autoscaling; VMSS provides static VM grouping", "VMSS is only available for Linux VMs", "Availability Sets can span multiple regions; VMSS cannot"],
    correct: 0,
    explanation: "VMSS adds autoscaling capabilities (scale out/in based on metrics or schedules) in addition to high availability. Availability Sets only provide HA distribution without scaling."
  },
  {
    id: 31, domain: "Compute",
    question: "You need to run a containerized batch job that executes once and terminates. Infrastructure management should be MINIMAL. Which service is MOST cost-effective?",
    options: ["Azure Virtual Machines", "Azure Kubernetes Service (AKS)", "Azure Container Instances (ACI)", "Azure App Service"],
    correct: 2,
    explanation: "ACI provides serverless containers billed per second of execution. No cluster or server management required, making it ideal for short-lived, event-driven workloads."
  },
  {
    id: 32, domain: "Compute",
    question: "You need to deploy a web application without managing underlying infrastructure, with built-in autoscaling and deployment slots. Which Azure service should you use?",
    options: ["Azure Virtual Machines", "Azure App Service", "Azure Container Instances", "Azure VM Scale Sets"],
    correct: 1,
    explanation: "Azure App Service is a fully managed PaaS for web apps. It includes built-in autoscaling, SSL, custom domains, deployment slots for blue/green deployments, and no OS/VM management."
  },
  {
    id: 33, domain: "Compute",
    question: "You need to connect to a Windows VM via RDP without exposing port 3389 to the internet. What is the RECOMMENDED solution?",
    options: ["Configure a VPN Gateway and use VPN client", "Deploy Azure Bastion", "Use Just-in-Time (JIT) VM Access", "Configure an NSG rule to allow port 3389 from your IP only"],
    correct: 1,
    explanation: "Azure Bastion provides browser-based RDP/SSH over TLS (port 443) to VMs without any public IP on the VM or open RDP/SSH ports. JIT is also valid but Bastion is the cleaner solution."
  },
  {
    id: 34, domain: "Compute",
    question: "An AKS cluster needs to pull container images from a private Azure Container Registry (ACR) WITHOUT storing credentials as Kubernetes secrets. What is the RECOMMENDED approach?",
    options: ["Create an imagePullSecret with ACR credentials", "Make the ACR registry public", "Attach the ACR to the AKS cluster using managed identity", "Use a service principal with password stored in a ConfigMap"],
    correct: 2,
    explanation: "Attaching ACR to AKS using managed identity is the recommended secretless approach. AKS uses its system-assigned or user-assigned managed identity to authenticate to ACR without storing credentials."
  },
  {
    id: 35, domain: "Compute",
    question: "What is the purpose of the Custom Script Extension on Azure VMs?",
    options: ["Enable Azure Monitor agent automatically after deployment", "Run PowerShell or shell scripts on a VM after provisioning for configuration", "Create automated VM snapshots on a schedule", "Resize VM disks without downtime"],
    correct: 1,
    explanation: "Custom Script Extension downloads and executes scripts on VMs post-deployment. Commonly used for software installation, configuration, and post-provisioning setup tasks."
  },
  {
    id: 36, domain: "Compute",
    question: "Which Azure VM disk type provides the HIGHEST IOPS and LOWEST latency, suitable for mission-critical databases?",
    options: ["Standard HDD", "Standard SSD", "Premium SSD", "Ultra Disk"],
    correct: 3,
    explanation: "Ultra Disk provides configurable IOPS (up to 160,000) and throughput with sub-millisecond latency. Ideal for IO-intensive workloads like SAP HANA, SQL Server, and Oracle."
  },
  {
    id: 37, domain: "Compute",
    question: "You decommission a VM but want to reuse its managed OS disk for a new VM later. What should you do?",
    options: ["Deallocate the VM and leave it stopped", "Delete the VM resource while keeping the managed disk (uncheck 'Delete disk' option)", "Create a snapshot of the disk first, then delete everything", "Move the VM to a different resource group"],
    correct: 1,
    explanation: "When deleting a VM in Azure, you can choose to retain the managed disk. Uncheck the disk deletion option, and the disk remains as a standalone resource you can attach to another VM."
  },
  {
    id: 38, domain: "Compute",
    question: "What is the purpose of a Proximity Placement Group (PPG) in Azure?",
    options: ["Group VMs across different regions for global load balancing", "Co-locate VMs in the same physical datacenter to minimize network latency between them", "Apply NSG rules consistently to multiple VMs", "Replicate VM configurations across availability zones"],
    correct: 1,
    explanation: "Proximity Placement Groups constrain VM placement to minimize inter-VM network latency by ensuring VMs are physically close. Critical for HPC and latency-sensitive clustered applications."
  },
  {
    id: 39, domain: "Compute",
    question: "You need to deploy an identical VM configuration consistently across 3 regions. What is the MOST efficient and repeatable approach?",
    options: ["Manually configure each VM using the Azure portal", "Use ARM templates or Bicep for repeatable deployments", "Clone the VM from the first region using Azure Migrate", "Use Azure Site Recovery to replicate across regions"],
    correct: 1,
    explanation: "ARM templates and Bicep provide infrastructure-as-code for consistent, version-controlled, repeatable deployments across any region or environment."
  },
  {
    id: 40, domain: "Compute",
    question: "A VM's OS disk is running low on space. What is the supported way to resize an Azure managed disk?",
    options: ["Resize from the Azure portal while the VM is running (online resize for data disks)", "Deallocate the VM, resize the disk, then start the VM", "Create a new disk, copy data, and attach it", "Increase the disk size via disk striping"],
    correct: 0,
    explanation: "Azure supports online resize for data disks (without VM restart). OS disks typically require VM deallocation for resize. Only expansion is supported — managed disks cannot be shrunk."
  },
  {
    id: 41, domain: "Compute",
    question: "Azure Spot VMs are BEST suited for which type of workloads?",
    options: ["Production web applications with SLA requirements", "Fault-tolerant, interruptible batch processing or stateless workloads", "Mission-critical databases requiring 99.9% uptime", "Active Directory domain controllers"],
    correct: 1,
    explanation: "Spot VMs use spare Azure capacity at up to 90% discount but can be evicted with 30-second notice when capacity is needed. Only suitable for fault-tolerant, checkpointed, or stateless workloads."
  },
  {
    id: 42, domain: "Compute",
    question: "What does the 'Deallocated' state of an Azure VM mean, and what are the billing implications?",
    options: ["VM is running but paused; full compute charges apply", "VM is stopped and compute resources released; no compute charges, storage charges apply", "VM is deleted; no charges of any kind", "VM is in maintenance mode; partial compute charges apply"],
    correct: 1,
    explanation: "Deallocated VMs release their compute resources (CPU, RAM) back to Azure. You only pay for storage (OS disk, data disks) and any attached public IPs. This is different from 'Stopped' which still incurs compute charges."
  },
  {
    id: 43, domain: "Compute",
    question: "Which Azure container orchestration service is FULLY MANAGED, where Microsoft handles the control plane?",
    options: ["Self-managed Kubernetes on Azure VMs", "Azure Container Instances", "Azure Kubernetes Service (AKS)", "Azure Red Hat OpenShift"],
    correct: 2,
    explanation: "AKS is a managed Kubernetes service where Azure manages the Kubernetes control plane (API server, etcd) at no charge. You only pay for the agent (worker) nodes."
  },
  // ─── DOMAIN 4: Networking ────────────────────────────────────────────
  {
    id: 44, domain: "Networking",
    question: "Two VNets in the same region need to communicate privately with low latency. What is the SIMPLEST solution?",
    options: ["Site-to-Site VPN between the two VNets", "VNet Peering", "ExpressRoute", "Azure Relay"],
    correct: 1,
    explanation: "VNet Peering connects VNets through the Azure backbone with low latency and high bandwidth. No gateways or public internet required. VNet Global Peering works across regions."
  },
  {
    id: 45, domain: "Networking",
    question: "How are NSG rules evaluated when traffic hits a network interface or subnet?",
    options: ["From highest priority number to lowest; first match wins", "From lowest priority number to highest; first match wins", "Allow rules are always evaluated before deny rules", "Default rules always take precedence over custom rules"],
    correct: 1,
    explanation: "NSG rules are processed from lowest number (highest priority) to highest number. The FIRST matching rule is applied and processing stops. Lower numbers = higher priority."
  },
  {
    id: 46, domain: "Networking",
    question: "What is the default behavior of an NSG when NO custom rules match inbound traffic?",
    options: ["Allow all inbound traffic", "Allow traffic from within the VNet only", "Deny all inbound traffic (implicit deny-all)", "Log and allow the traffic"],
    correct: 2,
    explanation: "NSGs have built-in implicit deny-all rules at priority 65500 (DenyAllInbound, DenyAllOutbound) that block all traffic when no custom rule matches."
  },
  {
    id: 47, domain: "Networking",
    question: "VNet A is peered with VNet B. VNet B is peered with VNet C. Can VMs in VNet A directly reach VMs in VNet C?",
    options: ["Yes, VNet peering is transitive", "No, VNet peering is NOT transitive", "Yes, if 'Allow Gateway Transit' is enabled on all peerings", "Yes, if all VNets are in the same region"],
    correct: 1,
    explanation: "VNet peering is non-transitive. VNet A cannot reach VNet C through VNet B. You need a direct peering between A and C, or a hub-spoke design with a NVA/VPN gateway and 'Use Remote Gateways' enabled."
  },
  {
    id: 48, domain: "Networking",
    question: "You need all outbound internet traffic from VMs in a subnet to flow through a Network Virtual Appliance (NVA) for inspection. What should you configure?",
    options: ["NSG outbound rules on the subnet", "User Defined Route (UDR) with next hop set to the NVA's private IP", "Azure Firewall policy on the VNet", "Service endpoints for internet-bound traffic"],
    correct: 1,
    explanation: "UDRs (User Defined Routes) override Azure's default routing. Creating a route for 0.0.0.0/0 with next hop = NVA's private IP forces all outbound traffic through the appliance."
  },
  {
    id: 49, domain: "Networking",
    question: "You've configured a UDR routing traffic through an NVA, but VMs cannot reach the internet. The NVA is a VM. What is the MOST LIKELY missing configuration?",
    options: ["The UDR needs a BGP route", "IP Forwarding must be enabled on the NVA's network interface in Azure", "The NVA needs a public IP address", "An NSG rule must allow outbound on the NVA's subnet"],
    correct: 1,
    explanation: "Azure drops traffic destined for an IP different from the NIC's assigned IP unless IP Forwarding is enabled on that NIC. This must be enabled both in Azure AND within the OS of the NVA VM."
  },
  {
    id: 50, domain: "Networking",
    question: "Which Azure load balancer type operates at Layer 7 and supports path-based URL routing and WAF capabilities?",
    options: ["Azure Standard Load Balancer", "Azure Application Gateway", "Azure Traffic Manager", "Azure Front Door"],
    correct: 1,
    explanation: "Azure Application Gateway is an L7 load balancer supporting URL path-based routing, SSL termination, session affinity, and optionally WAF (Web Application Firewall)."
  },
  {
    id: 51, domain: "Networking",
    question: "You need to distribute traffic globally across multiple Azure regions based on the lowest latency for end users. Which service should you use?",
    options: ["Azure Standard Load Balancer", "Azure Application Gateway", "Azure Traffic Manager with 'Performance' routing method", "Azure Internal Load Balancer"],
    correct: 2,
    explanation: "Azure Traffic Manager is a DNS-based global traffic manager. The 'Performance' routing method directs users to the endpoint with the lowest latency from their location."
  },
  {
    id: 52, domain: "Networking",
    question: "You need to connect an on-premises network to Azure with a PRIVATE, DEDICATED connection NOT traversing the public internet. What should you use?",
    options: ["Site-to-Site VPN over IPSec", "Point-to-Site VPN", "Azure ExpressRoute", "VNet Peering with on-premises gateway"],
    correct: 2,
    explanation: "ExpressRoute provides a private, dedicated connection to Azure through a connectivity provider (e.g., Equinix, AT&T), not traversing the public internet. Offers predictable performance and lower latency than VPN."
  },
  {
    id: 53, domain: "Networking",
    question: "You need VMs in a VNet to resolve each other's hostnames using custom DNS names (e.g., vm1.contoso.internal). What is the SIMPLEST solution without deploying custom DNS servers?",
    options: ["Azure Traffic Manager with custom DNS", "Azure Private DNS Zone linked to the VNet", "Azure Public DNS Zone", "Configure /etc/hosts on each VM"],
    correct: 1,
    explanation: "Azure Private DNS Zones provide automatic DNS registration and resolution for VNet resources when auto-registration is enabled. No DNS server deployment required."
  },
  {
    id: 54, domain: "Networking",
    question: "What is the MAIN difference between Azure Firewall and Network Security Groups (NSGs)?",
    options: ["NSGs operate at Layer 7; Azure Firewall operates at Layer 4 only", "Azure Firewall is a managed, stateful firewall with FQDN filtering and threat intelligence; NSGs are stateless L3/L4 packet filters", "NSGs can filter HTTPS traffic by URL; Azure Firewall cannot", "Azure Firewall is free; NSGs are charged per rule"],
    correct: 1,
    explanation: "NSGs are simple, stateless L3/L4 packet filters at subnet/NIC level. Azure Firewall is a managed, stateful network security service with FQDN filtering, TLS inspection, and threat intelligence feeds."
  },
  {
    id: 55, domain: "Networking",
    question: "You need to capture network traffic flows through an NSG for security analysis and compliance auditing. Which feature should you enable?",
    options: ["Azure Monitor Diagnostic Settings for VMs", "NSG Flow Logs via Network Watcher", "Azure Firewall diagnostic logs", "Azure Sentinel data connector"],
    correct: 1,
    explanation: "NSG Flow Logs, enabled through Network Watcher, capture a 5-tuple (source/dest IP, port, protocol, allow/deny) of all traffic through NSGs. Logs go to a storage account and optionally to Log Analytics via Traffic Analytics."
  },
  {
    id: 56, domain: "Networking",
    question: "What is the purpose of a Service Endpoint in Azure networking?",
    options: ["Expose an Azure service via a private IP in your VNet", "Extend the VNet's identity to Azure services, allowing you to restrict service access to the VNet over the Azure backbone", "Create a DNS alias for Azure service URLs", "Route all traffic through Azure Firewall"],
    correct: 1,
    explanation: "Service Endpoints extend your VNet's private address space and identity to Azure services (Storage, SQL, etc.) over the Azure backbone, allowing you to lock down access to specific VNets/subnets. Note: the service still has a public endpoint."
  },
  {
    id: 57, domain: "Networking",
    question: "What does a Private Endpoint provide that a Service Endpoint does NOT?",
    options: ["BGP dynamic routing to the Azure service", "A private IP address in your VNet for the Azure service, making it reachable without public internet exposure", "Lower latency to Azure services", "Support for more Azure service types"],
    correct: 1,
    explanation: "Private Endpoints assign a private IP from your VNet to an Azure service (e.g., Storage, SQL, Key Vault), enabling fully private connectivity. The service is accessible only from your VNet or connected networks, with no public endpoint needed."
  },
  {
    id: 58, domain: "Networking",
    question: "An Azure Standard Load Balancer requires a health probe. A backend VM fails its health probe. What happens?",
    options: ["The VM is automatically restarted", "Traffic is no longer sent to that VM by the load balancer", "The VM is deleted and replaced", "An alert is triggered but traffic continues to flow"],
    correct: 1,
    explanation: "The Standard Load Balancer removes unhealthy backend instances (those failing health probes) from the rotation. Traffic is only sent to instances passing their probe."
  },
  // ─── DOMAIN 5: Monitor & Backup ─────────────────────────────────────
  {
    id: 59, domain: "Monitor & Backup",
    question: "You need to receive an email alert when a VM's CPU exceeds 85% for more than 5 minutes. What should you configure?",
    options: ["Azure Policy with Audit effect on CPU metrics", "Azure Monitor Metric Alert with a threshold rule on Percentage CPU", "Azure Security Center high CPU alert", "Log Analytics query alert on Windows Event Log"],
    correct: 1,
    explanation: "Azure Monitor Metric Alerts evaluate platform metrics (like Percentage CPU) against thresholds over configurable time windows. When the threshold is exceeded for the window, an alert fires."
  },
  {
    id: 60, domain: "Monitor & Backup",
    question: "What is the purpose of a Log Analytics Workspace in Azure Monitor?",
    options: ["Store VM OS disk snapshots for recovery", "Centrally collect, store, and query log and performance data from multiple Azure and on-premises sources using KQL", "Provide real-time VM performance dashboards only", "Replace Azure Storage for all diagnostic data"],
    correct: 1,
    explanation: "Log Analytics Workspaces are centralized data stores for monitoring telemetry from VMs, applications, services, and on-premises systems. Data is queried using KQL (Kusto Query Language)."
  },
  {
    id: 61, domain: "Monitor & Backup",
    question: "What is the CORRECT difference between Azure Backup and Azure Site Recovery?",
    options: ["Azure Backup replicates to a secondary region; Site Recovery creates backups on a schedule", "Azure Backup protects against data loss/corruption (backup/restore); Azure Site Recovery enables disaster recovery with continuous replication and regional failover", "Site Recovery is for file-level backup; Azure Backup is for VM-level recovery only", "Both services are identical but differ only in pricing"],
    correct: 1,
    explanation: "Azure Backup = data protection (scheduled backups, point-in-time restore). Azure Site Recovery = business continuity and DR (continuous replication, orchestrated failover to another region with near-zero RPO)."
  },
  {
    id: 62, domain: "Monitor & Backup",
    question: "Azure Monitor Activity Log retains data for how long by default, and what should you do to retain it longer?",
    options: ["7 days default; extend via Azure Policy", "30 days default; purchase a Log Analytics premium tier", "90 days default; configure Diagnostic Settings to send to a Log Analytics workspace or Storage Account", "365 days default; no action needed"],
    correct: 2,
    explanation: "Activity Logs are retained for 90 days by default. To retain longer, use Diagnostic Settings to archive to a Storage Account (up to years) or stream to a Log Analytics workspace with custom retention."
  },
  {
    id: 63, domain: "Monitor & Backup",
    question: "Which Azure Monitor feature provides CPU, memory, disk, and dependency maps for VMs without writing custom queries?",
    options: ["Azure Advisor", "VM Insights", "Application Insights", "Azure Service Health"],
    correct: 1,
    explanation: "VM Insights provides curated performance charts and a dependency map (using the Dependency Agent) for VMs and VM Scale Sets, pre-built without requiring custom KQL queries."
  },
  {
    id: 64, domain: "Monitor & Backup",
    question: "What is Azure Service Health used for?",
    options: ["Monitor individual VM CPU and memory metrics", "Track Azure platform incidents, planned maintenance events, and health advisories affecting YOUR specific subscriptions and regions", "Configure alerting thresholds for Azure services", "Manage RBAC for monitoring resources"],
    correct: 1,
    explanation: "Azure Service Health provides personalized alerts and information about Azure service incidents, planned maintenance, and health advisories, filtered to the subscriptions and regions you use."
  },
  {
    id: 65, domain: "Monitor & Backup",
    question: "What is the purpose of Action Groups in Azure Monitor?",
    options: ["Group Azure resources for applying policies", "Define a collection of notification actions (email, SMS, webhook, runbook) triggered when an alert fires", "Organize metric data into logical categories", "Apply RBAC roles to monitoring data"],
    correct: 1,
    explanation: "Action Groups define WHO to notify and WHAT to do when an alert fires: send email/SMS, call webhooks, trigger Azure Functions/Logic Apps/Automation Runbooks, or create ITSM tickets."
  },
  {
    id: 66, domain: "Monitor & Backup",
    question: "Which query language is used to query data in Azure Log Analytics workspaces?",
    options: ["SQL (T-SQL)", "PowerShell", "KQL (Kusto Query Language)", "Azure Resource Graph (ARG) syntax"],
    correct: 2,
    explanation: "Azure Monitor Log Analytics uses KQL (Kusto Query Language). It's also used in Azure Data Explorer, Microsoft Sentinel, and Azure Resource Graph."
  },
  {
    id: 67, domain: "Monitor & Backup",
    question: "You need to back up an Azure VM with a recovery point objective (RPO) of 24 hours and retain backups for 30 days. Which service should you use?",
    options: ["VM Snapshots stored in a storage account", "Azure Site Recovery with daily replication", "Azure Backup with Recovery Services Vault and a backup policy", "Azure Blob Storage with geo-replication"],
    correct: 2,
    explanation: "Azure Backup with a Recovery Services Vault and backup policy allows you to schedule daily backups and configure retention policies (daily, weekly, monthly, yearly) for VMs and other workloads."
  },
  {
    id: 68, domain: "Monitor & Backup",
    question: "Which Azure tool provides recommendations to reduce costs by identifying underutilized VMs and unattached disks?",
    options: ["Azure Monitor", "Azure Security Center", "Azure Advisor", "Azure Cost Management + Billing"],
    correct: 2,
    explanation: "Azure Advisor provides actionable recommendations across five categories: Cost, Reliability, Security, Performance, and Operational Excellence. It identifies idle/underutilized resources to reduce spend."
  },
  {
    id: 69, domain: "Monitor & Backup",
    question: "You want a non-compliant Azure Policy to automatically deploy a Log Analytics agent to VMs that are missing it. Which policy effect should you use?",
    options: ["Audit", "Deny", "Modify", "DeployIfNotExists"],
    correct: 3,
    explanation: "DeployIfNotExists triggers an ARM template deployment (e.g., installing an agent) when a resource doesn't have a specified related resource. Remediation tasks apply this to existing non-compliant resources."
  },
  {
    id: 70, domain: "Monitor & Backup",
    question: "An Azure Backup job for a VM fails. Where do you FIRST look to diagnose the failure reason?",
    options: ["VM Boot Diagnostics", "Azure Monitor Activity Log", "Recovery Services Vault → Backup Jobs", "Azure Advisor recommendations"],
    correct: 2,
    explanation: "The Recovery Services Vault's 'Backup Jobs' section shows the status, error codes, and detailed messages for all backup and restore operations, making it the first place to diagnose failures."
  },
];

const DOMAIN_META = {
  "Identities & Governance": { color: "#0078D4", bg: "rgba(0,120,212,0.12)", icon: "🔐" },
  "Storage":                  { color: "#00BCF2", bg: "rgba(0,188,242,0.12)", icon: "🗄️" },
  "Compute":                  { color: "#FF8C00", bg: "rgba(255,140,0,0.12)", icon: "⚙️" },
  "Networking":               { color: "#7FBA00", bg: "rgba(127,186,0,0.12)", icon: "🌐" },
  "Monitor & Backup":         { color: "#D83B01", bg: "rgba(216,59,1,0.12)", icon: "📊" },
};

export default function App() {
  const [queue, setQueue] = useState(() => shuffle(QUESTIONS));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [wrongPool, setWrongPool] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [phase, setPhase] = useState("quiz");
  const [domainStats, setDomainStats] = useState({});

  const q = queue[idx];
  const meta = DOMAIN_META[q?.domain] || { color: "#888", bg: "rgba(136,136,136,0.1)", icon: "❓" };
  const progress = Math.round((idx / queue.length) * 100);
  const isCorrect = selected === q?.correct;

  const handleSelect = (i) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    const ok = i === q.correct;
    setTotal(t => t + 1);
    if (ok) {
      setCorrect(c => c + 1);
      setDomainStats(ds => ({ ...ds, [q.domain]: { c: (ds[q.domain]?.c || 0) + 1, t: (ds[q.domain]?.t || 0) + 1 } }));
    } else {
      setWrongPool(w => [...w, q]);
      setDomainStats(ds => ({ ...ds, [q.domain]: { c: ds[q.domain]?.c || 0, t: (ds[q.domain]?.t || 0) + 1 } }));
    }
  };

  const handleNext = () => {
    if (idx + 1 < queue.length) {
      setIdx(i => i + 1); setSelected(null); setAnswered(false);
    } else {
      if (wrongPool.length > 0 && phase === "quiz") {
        setPhase("review"); setQueue(shuffle(wrongPool)); setWrongPool([]);
        setIdx(0); setSelected(null); setAnswered(false);
      } else { setPhase("done"); }
    }
  };

  const restart = () => {
    setPhase("quiz"); setQueue(shuffle(QUESTIONS)); setIdx(0);
    setSelected(null); setAnswered(false); setWrongPool([]);
    setCorrect(0); setTotal(0); setDomainStats({});
  };

  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  const LETTERS = ["A", "B", "C", "D", "E"];

  const s = {
    root: { minHeight: "100vh", background: "#0a0e17", color: "#e8eaf0", fontFamily: "'Segoe UI', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px" },
    header: { width: "100%", maxWidth: 760, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
    logoBox: { background: "#0078D4", color: "#fff", fontFamily: "monospace", fontWeight: 700, fontSize: 11, padding: "4px 8px", borderRadius: 4, letterSpacing: 1 },
    logoTitle: { fontSize: 15, fontWeight: 600, color: "#c5cad6", letterSpacing: 0.5, marginLeft: 10 },
    statsRow: { display: "flex", gap: 16, fontSize: 12, color: "#6b7280" },
    card: { width: "100%", maxWidth: 760, background: "#111827", border: "1px solid #1f2937", borderRadius: 16, padding: "32px 36px", marginBottom: 16 },
    domainBadge: { display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 20, background: meta.bg, color: meta.color, border: `1px solid ${meta.color}33` },
    qCount: { fontSize: 11, color: "#4b5563", marginBottom: 12, fontFamily: "monospace", letterSpacing: 1 },
    question: { fontSize: 18, lineHeight: 1.65, color: "#f1f5f9", fontWeight: 500, marginBottom: 28 },
    options: { display: "flex", flexDirection: "column", gap: 10 },
    progressBar: { width: "100%", maxWidth: 760, background: "#1f2937", borderRadius: 99, height: 4, marginBottom: 16, overflow: "hidden" },
    progressFill: { height: "100%", borderRadius: 99, background: "#0078D4", width: `${progress}%`, transition: "width 0.3s ease" },
    nextBtn: { width: "100%", maxWidth: 760, padding: "14px", background: "#0078D4", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: 0.5, marginTop: 8 },
    reviewBanner: { width: "100%", maxWidth: 760, background: "rgba(255,140,0,0.08)", border: "1px solid rgba(255,140,0,0.3)", borderRadius: 10, padding: "10px 16px", fontSize: 12, color: "#fbbf24", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 },
    explanation: { marginTop: 20, padding: "16px 18px", background: "#0f1923", border: "1px solid #1e3a5f", borderRadius: 10, fontSize: 13, color: "#93c5fd", lineHeight: 1.7 },
    explanationLabel: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#60a5fa", textTransform: "uppercase", marginBottom: 6 },
    doneCard: { width: "100%", maxWidth: 760, background: "#111827", border: "1px solid #1f2937", borderRadius: 16, padding: "40px 36px", textAlign: "center" },
    scoreCircle: { width: 120, height: 120, borderRadius: "50%", border: `6px solid ${score >= 70 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", background: score >= 70 ? "rgba(34,197,94,0.08)" : score >= 50 ? "rgba(245,158,11,0.08)" : "rgba(239,68,68,0.08)" },
    scoreNum: { fontSize: 36, fontWeight: 800, color: score >= 70 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444", lineHeight: 1 },
    domainGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 24, textAlign: "left" },
    restartBtn: { marginTop: 28, padding: "13px 32px", background: "#0078D4", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  };

  const optionStyle = (i) => {
    let bg = "#1f2937", border = "1px solid #2d3748", color = "#cbd5e1";
    if (answered) {
      if (i === q.correct) { bg = "rgba(34,197,94,0.12)"; border = "1px solid #22c55e"; color = "#86efac"; }
      else if (i === selected) { bg = "rgba(239,68,68,0.12)"; border = "1px solid #ef4444"; color = "#fca5a5"; }
      else { bg = "#161e2e"; color = "#4b5563"; }
    }
    return { background: bg, border, borderRadius: 10, padding: "14px 18px", cursor: answered ? "default" : "pointer", color, fontSize: 14, lineHeight: 1.5, display: "flex", alignItems: "flex-start", gap: 12, transition: "all 0.15s ease" };
  };

  const letterStyle = (i) => {
    let bg = "#2d3748", color = "#9ca3af";
    if (answered && i === q.correct) { bg = "#22c55e"; color = "#fff"; }
    else if (answered && i === selected && i !== q.correct) { bg = "#ef4444"; color = "#fff"; }
    return { minWidth: 26, height: 26, borderRadius: 6, background: bg, color, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", flexShrink: 0, marginTop: 1 };
  };

  if (phase === "done") {
    return (
      <div style={s.root}>
        <div style={s.doneCard}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16, letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace" }}>Session Complete</div>
          <div style={s.scoreCircle}>
            <span style={s.scoreNum}>{score}%</span>
            <span style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>score</span>
          </div>
          <div style={{ fontSize: 15, color: "#94a3b8", marginBottom: 4 }}>{correct} correct out of {total} questions</div>
          <div style={{ fontSize: 13, color: "#4b5563" }}>
            {score >= 70 ? "🟢 On track — keep pushing to 85%+" : score >= 50 ? "🟡 Getting there — review your weak domains" : "🔴 Focus on fundamentals in your weak areas"}
          </div>
          <div style={s.domainGrid}>
            {Object.entries(DOMAIN_META).map(([domain, m]) => {
              const ds = domainStats[domain];
              const pct = ds ? Math.round((ds.c / ds.t) * 100) : null;
              return (
                <div key={domain} style={{ background: m.bg, border: `1px solid ${m.color}33`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: m.color, letterSpacing: 0.5, marginBottom: 4 }}>{m.icon} {domain}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9" }}>{pct !== null ? `${pct}%` : "—"}</div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{ds ? `${ds.c}/${ds.t} correct` : "not attempted"}</div>
                </div>
              );
            })}
          </div>
          <button style={s.restartBtn} onClick={restart}>🔄 New Session</button>
          <div style={{ marginTop: 12, fontSize: 11, color: "#374151" }}>AZ-104 passing score: 700/1000 (≈70%) · Exam until June 30, 2026</div>
          <div style={{ marginTop: 16, fontSize: 11, color: "#374151" }}>Hecho en conjunto por <strong style={{ color: "#4b5563" }}>Fabián Muñoz</strong> y <strong style={{ color: "#4b5563" }}>Nano Claw</strong> 🤝</div>
        </div>
      </div>
    );
  }

  if (!q) return null;

  return (
    <div style={s.root}>
      <div style={s.header}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={s.logoBox}>AZ-104</span>
          <span style={s.logoTitle}>Azure Administrator · Study Mode</span>
        </div>
        <div style={s.statsRow}>
          <span style={{ color: "#22c55e" }}>✓ {correct}</span>
          <span style={{ color: "#ef4444" }}>✗ {total - correct}</span>
          <span>{idx + 1}/{queue.length}</span>
        </div>
      </div>

      {phase === "review" && (
        <div style={s.reviewBanner}>⚠️ <strong>Review Round</strong> — {queue.length} question{queue.length !== 1 ? "s" : ""} you answered incorrectly. Focus up.</div>
      )}

      <div style={s.progressBar}><div style={s.progressFill} /></div>

      <div style={s.card}>
        <div style={s.domainBadge}>{meta.icon} {q.domain}</div>
        <div style={s.qCount}>Q{q.id} of 70</div>
        <div style={s.question}>{q.question}</div>
        <div style={s.options}>
          {q.options.map((opt, i) => (
            <div key={i} style={optionStyle(i)} onClick={() => handleSelect(i)}>
              <span style={letterStyle(i)}>{LETTERS[i]}</span>
              <span>{opt}</span>
            </div>
          ))}
        </div>
        {answered && (
          <div style={s.explanation}>
            <div style={s.explanationLabel}>{isCorrect ? "✓ Correct" : "✗ Incorrect"} · Explanation</div>
            {q.explanation}
          </div>
        )}
      </div>

      {answered && (
        <button style={s.nextBtn} onClick={handleNext}>
          {idx + 1 < queue.length ? "Next Question →" : phase === "quiz" && wrongPool.length > 0 ? `Review ${wrongPool.length} incorrect answers →` : "See Results →"}
        </button>
      )}
    </div>
  );
}
