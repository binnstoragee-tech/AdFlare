(() => {
  // ../pos/src/data/demo.js
  var navGroups = [
    { label: "Workspace", items: [{ id: "home", label: "Home", icon: "home" }] },
    {
      label: "Point of sale",
      items: [
        { id: "sell", label: "Sell", icon: "cart" },
        { id: "register", label: "Register", icon: "cash" },
        { id: "sessions", label: "Register sessions", icon: "clock" },
        { id: "gift-cards", label: "Gift cards", icon: "gift" },
        { id: "quotations", label: "Quotations", icon: "quote" },
        { id: "online-payments", label: "Online payments", icon: "card" },
        { id: "bill-history", label: "Bill history", icon: "receipt" }
      ]
    },
    { label: "Relationships", items: [{ id: "customers", label: "Customers", icon: "users" }] },
    {
      label: "Catalog",
      items: [
        { id: "products", label: "Products", icon: "box" },
        { id: "categories", label: "Categories", icon: "layers" }
      ]
    },
    {
      label: "Inventory & purchasing",
      items: [
        { id: "inventory", label: "Inventory", icon: "inventory" },
        { id: "stock-counts", label: "Stock counts", icon: "checklist" },
        { id: "stock-transfers", label: "Stock transfers", icon: "transfer" },
        { id: "suppliers", label: "Suppliers", icon: "truck" },
        { id: "purchase-orders", label: "Purchase orders", icon: "purchase" },
        { id: "receive-stock", label: "Receive stock", icon: "checklist" },
        { id: "landed-costs", label: "Landed costs", icon: "coins" }
      ]
    },
    {
      label: "Digital commerce",
      items: [
        { id: "online-orders", label: "Online orders", icon: "globe" },
        { id: "order-products", label: "Order products", icon: "tag" }
      ]
    },
    {
      label: "Operations",
      items: [
        { id: "expenses", label: "Expenses", icon: "wallet" },
        { id: "expense-categories", label: "Expense categories", icon: "folder" }
      ]
    },
    {
      label: "Insights",
      items: [
        { id: "reports", label: "Reports", icon: "report" },
        { id: "analytics", label: "Analytics", icon: "chart" }
      ]
    },
    { label: "Administration", items: [{ id: "admin", label: "Admin settings", icon: "settings" }] }
  ];
  var pageMeta = {
    home: { title: "Sales dashboard", subtitle: "A clear view of today\u2019s store performance.", type: "home" },
    sell: { title: "Point of sale", subtitle: "Build a cart and preview checkout.", type: "sell" },
    register: { title: "Register", subtitle: "Manage the sample register and shift.", type: "register" },
    sessions: { title: "Register sessions", subtitle: "Review opening and closing activity.", dataKey: "sessions", action: "New session", columns: [["id", "Session"], ["register", "Register"], ["openedBy", "Opened by"], ["openedAt", "Opened"], ["closedAt", "Closed"], ["expectedCash", "Expected cash"], ["variance", "Variance"], ["status", "Status"]], fields: [["register", "Register", "text", true], ["openingFloat", "Opening float", "number", true], ["openedBy", "Opened by", "text", true]] },
    "gift-cards": { title: "Gift cards", subtitle: "Track sample gift-card balances and activity.", dataKey: "giftCards", action: "Issue gift card", columns: [["code", "Card number"], ["customer", "Customer"], ["issuedAt", "Issued"], ["balance", "Balance"], ["expires", "Expires"], ["status", "Status"]], fields: [["code", "Card number", "text", true], ["customer", "Customer", "text", true], ["balance", "Initial value", "number", true], ["expires", "Expires", "date", false]] },
    quotations: { title: "Quotations", subtitle: "Create and review sample quotes before a sale.", dataKey: "quotations", action: "New quotation", columns: [["id", "Quote"], ["customer", "Customer"], ["createdAt", "Created"], ["items", "Items"], ["total", "Total"], ["expires", "Valid until"], ["status", "Status"]], fields: [["customer", "Customer", "text", true], ["items", "Items", "number", true], ["total", "Total", "number", true], ["expires", "Valid until", "date", false], ["note", "Notes", "text", false]] },
    "online-payments": { title: "Online payments", subtitle: "Review sample payment submissions and statuses.", dataKey: "onlinePayments", action: null, columns: [["id", "Payment"], ["order", "Order"], ["customer", "Customer"], ["method", "Method"], ["submittedAt", "Submitted"], ["amount", "Amount"], ["status", "Status"]] },
    "bill-history": { title: "Bill history", subtitle: "Search completed, pending and void sample bills.", dataKey: "bills", action: null, columns: [["id", "Bill"], ["date", "Date"], ["customer", "Customer"], ["items", "Items"], ["method", "Payment"], ["total", "Total"], ["status", "Status"]] },
    customers: { title: "Customers", subtitle: "Customer profiles, loyalty and account balances.", dataKey: "customers", action: "Add customer", columns: [["name", "Customer"], ["mobile", "Phone"], ["email", "Email"], ["visits", "Visits"], ["outstanding", "Outstanding"], ["loyalty", "Loyalty points"], ["status", "Status"]], fields: [["name", "Customer name", "text", true], ["mobile", "Phone", "tel", false], ["email", "Email", "email", false], ["address", "Address", "text", false], ["loyalty", "Loyalty points", "number", false]] },
    products: { title: "Products", subtitle: "Maintain products, prices and stock status.", dataKey: "products", action: "Add product", columns: [["sku", "SKU"], ["name", "Product"], ["category", "Category"], ["stockQty", "On hand"], ["price", "Price"], ["status", "Status"]], fields: [["sku", "SKU", "text", true], ["name", "Product name", "text", true], ["category", "Category", "text", true], ["stockQty", "Opening stock", "number", true], ["price", "Price (MVR)", "number", true], ["status", "Status", "text", false]] },
    categories: { title: "Categories", subtitle: "Organize the product catalog.", dataKey: "categories", action: "Add category", columns: [["name", "Category"], ["products", "Products"], ["updatedAt", "Last updated"], ["status", "Status"]], fields: [["name", "Category name", "text", true], ["description", "Description", "text", false]] },
    inventory: { title: "Inventory overview", subtitle: "Monitor stock health and recent movement.", type: "inventory" },
    "stock-counts": { title: "Stock counts", subtitle: "Plan and reconcile a sample physical count.", dataKey: "stockCounts", action: "Start stock count", columns: [["id", "Count"], ["outlet", "Branch"], ["startedAt", "Started"], ["items", "Items"], ["variance", "Variance"], ["status", "Status"]], fields: [["outlet", "Branch", "text", true], ["scope", "Count scope", "text", true], ["startedAt", "Start date", "date", true]] },
    "stock-transfers": { title: "Stock transfers", subtitle: "Move stock between sample branches.", dataKey: "transfers", action: "New transfer", columns: [["id", "Transfer"], ["from", "From"], ["to", "To"], ["items", "Items"], ["createdAt", "Created"], ["status", "Status"]], fields: [["from", "From branch", "text", true], ["to", "To branch", "text", true], ["items", "Number of items", "number", true], ["note", "Note", "text", false]] },
    suppliers: { title: "Suppliers", subtitle: "Supplier directory and purchasing contacts.", dataKey: "suppliers", action: "Add supplier", columns: [["name", "Supplier"], ["contact", "Contact"], ["email", "Email"], ["openOrders", "Open POs"], ["leadTime", "Lead time"], ["status", "Status"]], fields: [["name", "Supplier name", "text", true], ["contact", "Contact name", "text", false], ["email", "Email", "email", false], ["phone", "Phone", "tel", false], ["leadTime", "Lead time (days)", "number", false]] },
    "purchase-orders": { title: "Purchase orders", subtitle: "Create purchase requests and receive inventory.", dataKey: "purchaseOrders", action: "Create purchase order", columns: [["id", "PO number"], ["supplier", "Supplier"], ["createdAt", "Created"], ["expectedAt", "Expected"], ["items", "Items"], ["total", "Total"], ["status", "Status"]], fields: [["supplier", "Supplier", "text", true], ["expectedAt", "Expected date", "date", false], ["items", "Line items", "number", true], ["total", "Estimated total", "number", true]] },
    "landed-costs": { title: "Landed costs", subtitle: "Review freight and duty costs for received goods.", dataKey: "landedCosts", action: "Add landed cost", columns: [["purchaseOrder", "Purchase order"], ["supplier", "Supplier"], ["freight", "Freight"], ["duties", "Duties"], ["other", "Other"], ["total", "Total"], ["date", "Date"]], fields: [["purchaseOrder", "Purchase order", "text", true], ["freight", "Freight", "number", true], ["duties", "Duties", "number", false], ["other", "Other costs", "number", false]] },
    "online-orders": { title: "Online orders", subtitle: "Review incoming sample orders by channel.", dataKey: "onlineOrders", action: null, columns: [["id", "Order"], ["channel", "Channel"], ["customer", "Customer"], ["date", "Placed"], ["items", "Items"], ["total", "Total"], ["status", "Status"]] },
    "order-products": { title: "Order products", subtitle: "Product performance across sample online orders.", dataKey: "orderProducts", action: null, columns: [["name", "Product"], ["orders", "Orders"], ["quantity", "Units sold"], ["revenue", "Revenue"], ["returns", "Returns"], ["status", "Trend"]] },
    expenses: { title: "Expenses", subtitle: "Record operating costs and review sample spend.", dataKey: "expenses", action: "New expense", columns: [["date", "Date"], ["category", "Category"], ["description", "Description"], ["payee", "Payee"], ["method", "Payment"], ["amount", "Amount"], ["status", "Status"]], fields: [["date", "Date", "date", true], ["category", "Category", "text", true], ["description", "Description", "text", true], ["payee", "Payee", "text", false], ["amount", "Amount (MVR)", "number", true], ["method", "Payment method", "text", false]] },
    "expense-categories": { title: "Expense categories", subtitle: "Group and review operating expenses.", dataKey: "expenseCategories", action: "Add category", columns: [["name", "Category"], ["budget", "Monthly budget"], ["monthToDate", "Month to date"], ["variance", "Variance"], ["status", "Status"]], fields: [["name", "Category name", "text", true], ["budget", "Monthly budget (MVR)", "number", false]] },
    reports: { title: "Reports", subtitle: "Choose a report family to explore the sample reporting views.", type: "reports" },
    "sales-report": { title: "Sales report", subtitle: "Sample sales by day, payment method and status.", type: "report", dataKey: "bills" },
    "product-report": { title: "Product report", subtitle: "Sample units and revenue by product.", type: "report", dataKey: "orderProducts" },
    "online-orders-report": { title: "Online orders report", subtitle: "Sample online order volume and fulfillment.", type: "report", dataKey: "onlineOrders" },
    "purchasing-report": { title: "Purchasing report", subtitle: "Sample purchase order and supplier activity.", type: "report", dataKey: "purchaseOrders" },
    "loyalty-report": { title: "Loyalty report", subtitle: "Sample customer visits and points activity.", type: "report", dataKey: "customers" },
    "gift-card-report": { title: "Gift card report", subtitle: "Sample issuance and outstanding balances.", type: "report", dataKey: "giftCards" },
    "expenses-report": { title: "Expenses report", subtitle: "Sample spend by category and period.", type: "report", dataKey: "expenses" },
    analytics: { title: "Analytics", subtitle: "A high-level sample view of trends across the store.", type: "analytics" },
    admin: { title: "Admin settings", subtitle: "Choose a settings area to configure in the future live phase.", type: "admin" },
    "settings-general": { title: "General settings", subtitle: "Store details and operating defaults.", type: "settings", key: "general" },
    "settings-products": { title: "Product settings", subtitle: "Catalog identifiers and default product behavior.", type: "settings", key: "products" },
    "settings-inventory": { title: "Inventory settings", subtitle: "Stock thresholds and inventory rules.", type: "settings", key: "inventory" },
    "settings-transfers": { title: "Transfer settings", subtitle: "Rules for stock movement between branches.", type: "settings", key: "transfers" },
    "settings-purchasing": { title: "Purchasing settings", subtitle: "Purchase order and receiving defaults.", type: "settings", key: "purchasing" },
    "settings-loyalty": { title: "Loyalty settings", subtitle: "Sample loyalty earning and redemption rules.", type: "settings", key: "loyalty" },
    "settings-gift-cards": { title: "Gift card settings", subtitle: "Sample gift card issuance and expiry behavior.", type: "settings", key: "giftCards" },
    "settings-online-orders": { title: "Online order settings", subtitle: "Sample ecommerce fulfillment rules.", type: "settings", key: "onlineOrders" },
    "settings-employee-expenses": { title: "Employee expense settings", subtitle: "Sample staff expense approvals.", type: "settings", key: "employeeExpenses" },
    "settings-payments": { title: "Payment settings", subtitle: "Sample checkout payment methods.", type: "settings", key: "payments" },
    "settings-taxes": { title: "Taxes & fees", subtitle: "Sample tax and fee defaults.", type: "settings", key: "taxes" },
    "settings-ecommerce": { title: "Ecommerce settings", subtitle: "Sample storefront and integration preferences.", type: "settings", key: "ecommerce" },
    "receive-stock": { title: "Receive stock", subtitle: "Record a sample delivery against a purchase order.", type: "receive" }
  };
  var settingsSections = [
    { id: "settings-general", label: "General", detail: "Store identity, contact and business hours", icon: "settings" },
    { id: "settings-products", label: "Products", detail: "SKU, pricing and catalog defaults", icon: "box" },
    { id: "settings-inventory", label: "Inventory", detail: "Stock thresholds and valuation", icon: "inventory" },
    { id: "settings-transfers", label: "Transfers", detail: "Branch movement approvals", icon: "transfer" },
    { id: "settings-purchasing", label: "Purchasing", detail: "Purchase order and receive rules", icon: "purchase" },
    { id: "settings-loyalty", label: "Loyalty", detail: "Points and member rewards", icon: "gift" },
    { id: "settings-gift-cards", label: "Gift cards", detail: "Issuance and redemption", icon: "card" },
    { id: "settings-online-orders", label: "Online orders", detail: "Order handling and fulfillment", icon: "globe" },
    { id: "settings-employee-expenses", label: "Employee expenses", detail: "Staff spending and approvals", icon: "wallet" },
    { id: "settings-payments", label: "Payments", detail: "Checkout methods and settlement", icon: "cash" },
    { id: "settings-taxes", label: "Taxes & fees", detail: "Tax rates and service charges", icon: "coins" },
    { id: "settings-ecommerce", label: "Ecommerce", detail: "Storefront and integrations", icon: "shopping" }
  ];
  var settingsFields = {
    general: [["storeName", "Store name", "text"], ["address", "Address", "text"], ["phone", "Phone", "tel"], ["email", "Contact email", "email"], ["currency", "Display currency", "select", ["MVR", "USD"]], ["timezone", "Time zone", "select", ["Indian/Maldives", "Asia/Manila", "UTC"]]],
    products: [["skuPrefix", "SKU prefix", "text"], ["defaultUnit", "Default unit", "text"], ["allowNegativeStock", "Allow negative stock", "checkbox"]],
    inventory: [["lowStockThreshold", "Low-stock threshold", "number"], ["trackStock", "Track stock quantities", "checkbox"], ["valuationMethod", "Valuation method", "select", ["Average cost", "FIFO"]]],
    transfers: [["requireApproval", "Require approval", "checkbox"], ["autoReceive", "Auto-receive at destination", "checkbox"]],
    purchasing: [["poPrefix", "PO number prefix", "text"], ["defaultLeadTime", "Default lead time (days)", "number"], ["requireApproval", "Require purchase approval", "checkbox"]],
    loyalty: [["pointsPerUnit", "Points per MVR 100", "number"], ["redemptionValue", "Value per 100 points (MVR)", "number"], ["enabled", "Enable loyalty preview", "checkbox"]],
    giftCards: [["defaultExpiry", "Default expiry (months)", "number"], ["minimumValue", "Minimum value (MVR)", "number"], ["allowPartialRedemption", "Allow partial redemption", "checkbox"]],
    onlineOrders: [["autoAccept", "Auto-accept online orders", "checkbox"], ["defaultFulfillment", "Default fulfillment", "select", ["Pickup", "Delivery"]]],
    employeeExpenses: [["approvalLimit", "Approval required above (MVR)", "number"], ["requireReceipt", "Require receipt", "checkbox"]],
    payments: [["cashEnabled", "Cash", "checkbox"], ["cardEnabled", "Card", "checkbox"], ["transferEnabled", "Bank transfer", "checkbox"], ["creditEnabled", "Customer credit", "checkbox"]],
    taxes: [["taxRate", "Tax rate (%)", "number"], ["pricesIncludeTax", "Prices include tax", "checkbox"], ["serviceFee", "Service fee (%)", "number"]],
    ecommerce: [["storeUrl", "Store URL", "url"], ["syncInventory", "Sync inventory", "checkbox"], ["orderNotifications", "Order notifications", "checkbox"]]
  };
  var initialDemoData = {
    products: [
      { sku: "AF-1001", name: "House Blend Coffee", category: "Beverages", stockQty: 42, price: 85, status: "In stock" },
      { sku: "AF-1002", name: "Mineral Water 500ml", category: "Beverages", stockQty: 8, price: 25, status: "Low stock" },
      { sku: "AF-1003", name: "Classic Notebook", category: "Stationery", stockQty: 66, price: 120, status: "In stock" },
      { sku: "AF-1004", name: "Sea Salt Chips", category: "Snacks", stockQty: 4, price: 45, status: "Low stock" },
      { sku: "AF-1005", name: "Cotton Tote Bag", category: "Accessories", stockQty: 0, price: 260, status: "Out of stock" },
      { sku: "AF-1006", name: "Dark Chocolate Bar", category: "Snacks", stockQty: 31, price: 75, status: "In stock" },
      { sku: "AF-1007", name: "Herbal Tea Box", category: "Beverages", stockQty: 22, price: 140, status: "In stock" },
      { sku: "AF-1008", name: "Daily Planner", category: "Stationery", stockQty: 13, price: 310, status: "In stock" }
    ],
    categories: [
      { name: "Beverages", products: 18, updatedAt: "Today, 9:24 AM", status: "Active" },
      { name: "Snacks", products: 26, updatedAt: "Yesterday", status: "Active" },
      { name: "Stationery", products: 34, updatedAt: "Nov 15, 2026", status: "Active" },
      { name: "Accessories", products: 12, updatedAt: "Nov 13, 2026", status: "Active" },
      { name: "Seasonal", products: 7, updatedAt: "Nov 10, 2026", status: "Archived" }
    ],
    customers: [
      { name: "Mika Santos", mobile: "+960 777 0123", email: "mika@example.test", visits: 18, outstanding: 0, loyalty: 420, status: "Active" },
      { name: "Ari Dela Cruz", mobile: "+960 777 0456", email: "ari@example.test", visits: 11, outstanding: 380, loyalty: 285, status: "Active" },
      { name: "Nina Reyes", mobile: "+960 777 0789", email: "nina@example.test", visits: 7, outstanding: 0, loyalty: 165, status: "Active" },
      { name: "Theo Navarro", mobile: "+960 777 0321", email: "theo@example.test", visits: 4, outstanding: 960, loyalty: 80, status: "Review" },
      { name: "Sofia Lim", mobile: "+960 777 0987", email: "sofia@example.test", visits: 15, outstanding: 0, loyalty: 355, status: "Active" },
      { name: "Leo Martin", mobile: "+960 777 0654", email: "leo@example.test", visits: 3, outstanding: 125, loyalty: 40, status: "Active" }
    ],
    bills: [
      { id: "AF-2026-01842", date: "Today, 10:42 AM", customer: "Mika Santos", items: 3, method: "Card", total: 585, outlet: "Main branch", status: "Completed" },
      { id: "AF-2026-01841", date: "Today, 10:18 AM", customer: "Walk-in customer", items: 2, method: "Cash", total: 210, outlet: "Branch 1", status: "Completed" },
      { id: "AF-2026-01840", date: "Today, 9:56 AM", customer: "Ari Dela Cruz", items: 4, method: "Credit", total: 960, outlet: "Main branch", status: "Pending" },
      { id: "AF-2026-01839", date: "Today, 9:31 AM", customer: "Nina Reyes", items: 1, method: "Transfer", total: 140, outlet: "Branch 1", status: "Completed" },
      { id: "AF-2026-01838", date: "Yesterday, 5:46 PM", customer: "Sofia Lim", items: 5, method: "Cash", total: 825, outlet: "Main branch", status: "Voided" },
      { id: "AF-2026-01837", date: "Yesterday, 4:32 PM", customer: "Walk-in customer", items: 2, method: "Card", total: 430, outlet: "Branch 1", status: "Completed" },
      { id: "AF-2026-01836", date: "Yesterday, 3:05 PM", customer: "Theo Navarro", items: 3, method: "Credit", total: 340, outlet: "Main branch", status: "Pending" }
    ],
    sessions: [
      { id: "SES-00814", register: "Front counter", openedBy: "M. Santos", openedAt: "Today, 8:02 AM", closedAt: "\u2014", expectedCash: 1850, variance: "\u2014", status: "Open" },
      { id: "SES-00813", register: "Front counter", openedBy: "A. Dela Cruz", openedAt: "Yesterday, 8:00 AM", closedAt: "Yesterday, 6:12 PM", expectedCash: 6420, variance: "+20", status: "Closed" },
      { id: "SES-00812", register: "Branch 1 counter", openedBy: "N. Reyes", openedAt: "Yesterday, 9:14 AM", closedAt: "Yesterday, 5:45 PM", expectedCash: 3920, variance: "-10", status: "Closed" },
      { id: "SES-00811", register: "Front counter", openedBy: "S. Lim", openedAt: "Nov 16, 8:06 AM", closedAt: "Nov 16, 6:02 PM", expectedCash: 7110, variance: "0", status: "Closed" },
      { id: "SES-00810", register: "Branch 1 counter", openedBy: "L. Martin", openedAt: "Nov 16, 9:02 AM", closedAt: "Nov 16, 5:58 PM", expectedCash: 2840, variance: "+15", status: "Closed" }
    ],
    giftCards: [
      { code: "GC-004812", customer: "Mika Santos", issuedAt: "Nov 16, 2026", balance: 500, expires: "Nov 16, 2027", status: "Active" },
      { code: "GC-004811", customer: "Walk-in customer", issuedAt: "Nov 15, 2026", balance: 250, expires: "Nov 15, 2027", status: "Active" },
      { code: "GC-004810", customer: "Sofia Lim", issuedAt: "Nov 12, 2026", balance: 0, expires: "Nov 12, 2027", status: "Redeemed" },
      { code: "GC-004809", customer: "Ari Dela Cruz", issuedAt: "Nov 10, 2026", balance: 1e3, expires: "Nov 10, 2027", status: "Active" }
    ],
    quotations: [
      { id: "QT-00621", customer: "Sofia Lim", createdAt: "Today, 9:58 AM", items: 5, total: 2140, expires: "Nov 25, 2026", status: "Open" },
      { id: "QT-00620", customer: "Mika Santos", createdAt: "Yesterday, 2:10 PM", items: 3, total: 890, expires: "Nov 22, 2026", status: "Open" },
      { id: "QT-00619", customer: "Leo Martin", createdAt: "Nov 16, 2026", items: 2, total: 430, expires: "Nov 23, 2026", status: "Converted" },
      { id: "QT-00618", customer: "Ari Dela Cruz", createdAt: "Nov 14, 2026", items: 4, total: 1680, expires: "Nov 21, 2026", status: "Expired" }
    ],
    onlinePayments: [
      { id: "PAY-09012", order: "ON-04382", customer: "Nina Reyes", method: "Bank transfer", submittedAt: "Today, 10:11 AM", amount: 1240, status: "Review" },
      { id: "PAY-09011", order: "ON-04381", customer: "Mika Santos", method: "Card", submittedAt: "Today, 9:48 AM", amount: 860, status: "Approved" },
      { id: "PAY-09010", order: "ON-04380", customer: "Theo Navarro", method: "Bank transfer", submittedAt: "Yesterday, 4:25 PM", amount: 2250, status: "Review" },
      { id: "PAY-09009", order: "ON-04379", customer: "Ari Dela Cruz", method: "Card", submittedAt: "Yesterday, 2:08 PM", amount: 715, status: "Rejected" }
    ],
    stockCounts: [
      { id: "CNT-00142", outlet: "Main branch", startedAt: "Today, 8:30 AM", items: 84, variance: "3 items", status: "In progress" },
      { id: "CNT-00141", outlet: "Branch 1", startedAt: "Nov 16, 2026", items: 56, variance: "2 items", status: "Completed" },
      { id: "CNT-00140", outlet: "Main branch", startedAt: "Nov 12, 2026", items: 128, variance: "5 items", status: "Completed" }
    ],
    transfers: [
      { id: "TR-00714", from: "Main branch", to: "Branch 1", items: 8, createdAt: "Today, 9:20 AM", status: "In transit" },
      { id: "TR-00713", from: "Branch 1", to: "Main branch", items: 4, createdAt: "Yesterday, 2:15 PM", status: "Received" },
      { id: "TR-00712", from: "Main branch", to: "Branch 2", items: 11, createdAt: "Nov 15, 2026", status: "Draft" }
    ],
    suppliers: [
      { name: "Island Supply Co.", contact: "R. Hassan", email: "orders@islandsupply.example", openOrders: 2, leadTime: "3 days", status: "Active" },
      { name: "Northstar Wholesale", contact: "J. Cruz", email: "sales@northstar.example", openOrders: 1, leadTime: "5 days", status: "Active" },
      { name: "Paper & Things", contact: "K. Lee", email: "hello@paperthings.example", openOrders: 0, leadTime: "2 days", status: "Active" },
      { name: "Fresh Market Goods", contact: "M. Ali", email: "team@freshmarket.example", openOrders: 0, leadTime: "4 days", status: "On hold" }
    ],
    purchaseOrders: [
      { id: "PO-00984", supplier: "Island Supply Co.", createdAt: "Today, 8:42 AM", expectedAt: "Nov 21, 2026", items: 12, total: 14850, outlet: "Main branch", status: "Awaiting delivery" },
      { id: "PO-00983", supplier: "Paper & Things", createdAt: "Yesterday, 3:19 PM", expectedAt: "Nov 20, 2026", items: 8, total: 6240, outlet: "Branch 1", status: "Part received" },
      { id: "PO-00982", supplier: "Northstar Wholesale", createdAt: "Nov 15, 2026", expectedAt: "Nov 19, 2026", items: 16, total: 24200, outlet: "Main branch", status: "Received" }
    ],
    receipts: [
      { id: "RCV-00321", purchaseOrder: "PO-00982", product: "House Blend Coffee", quantity: 24, receivedAt: "Nov 17, 2026", status: "Received" },
      { id: "RCV-00320", purchaseOrder: "PO-00981", product: "Classic Notebook", quantity: 18, receivedAt: "Nov 13, 2026", status: "Received" },
      { id: "RCV-00319", purchaseOrder: "PO-00980", product: "Herbal Tea Box", quantity: 12, receivedAt: "Nov 11, 2026", status: "Received" }
    ],
    landedCosts: [
      { purchaseOrder: "PO-00982", supplier: "Northstar Wholesale", freight: 450, duties: 120, other: 0, total: 570, date: "Nov 17, 2026" },
      { purchaseOrder: "PO-00981", supplier: "Island Supply Co.", freight: 380, duties: 85, other: 30, total: 495, date: "Nov 13, 2026" },
      { purchaseOrder: "PO-00980", supplier: "Paper & Things", freight: 180, duties: 0, other: 0, total: 180, date: "Nov 11, 2026" }
    ],
    onlineOrders: [
      { id: "ON-04382", channel: "Web store", customer: "Nina Reyes", date: "Today, 10:11 AM", items: 4, total: 1240, outlet: "Main branch", status: "Payment review" },
      { id: "ON-04381", channel: "Instagram", customer: "Mika Santos", date: "Today, 9:48 AM", items: 2, total: 860, outlet: "Branch 1", status: "Processing" },
      { id: "ON-04380", channel: "Web store", customer: "Theo Navarro", date: "Yesterday, 4:25 PM", items: 6, total: 2250, outlet: "Main branch", status: "Ready to ship" },
      { id: "ON-04379", channel: "Marketplace", customer: "Ari Dela Cruz", date: "Yesterday, 2:08 PM", items: 3, total: 715, outlet: "Branch 1", status: "Cancelled" }
    ],
    orderProducts: [
      { name: "House Blend Coffee", orders: 148, quantity: 212, revenue: 18020, returns: 1, status: "Trending up" },
      { name: "Classic Notebook", orders: 112, quantity: 136, revenue: 16320, returns: 0, status: "Steady" },
      { name: "Dark Chocolate Bar", orders: 98, quantity: 164, revenue: 12300, returns: 2, status: "Trending up" },
      { name: "Herbal Tea Box", orders: 73, quantity: 84, revenue: 11760, returns: 0, status: "Steady" }
    ],
    expenses: [
      { date: "Today, 9:15 AM", category: "Store supplies", description: "Receipt paper and bags", payee: "Office Corner", method: "Cash", amount: 420, status: "Approved" },
      { date: "Yesterday, 4:05 PM", category: "Utilities", description: "Monthly internet", payee: "FiberNet", method: "Transfer", amount: 1200, status: "Approved" },
      { date: "Nov 16, 2026", category: "Transport", description: "Delivery fuel", payee: "M. Santos", method: "Cash", amount: 650, status: "Review" },
      { date: "Nov 15, 2026", category: "Marketing", description: "Weekend promotion print", payee: "Print House", method: "Card", amount: 980, status: "Approved" }
    ],
    expenseCategories: [
      { name: "Utilities", budget: 5e3, monthToDate: 2380, variance: "-2620", status: "On track" },
      { name: "Store supplies", budget: 2500, monthToDate: 1840, variance: "-660", status: "On track" },
      { name: "Transport", budget: 3e3, monthToDate: 3290, variance: "+290", status: "Over budget" },
      { name: "Marketing", budget: 3500, monthToDate: 2100, variance: "-1400", status: "On track" }
    ]
  };
  var reportCards = [
    { id: "sales-report", label: "Sales", detail: "Net sales, orders, payment mix", icon: "report", accent: "red" },
    { id: "product-report", label: "Products", detail: "Best sellers, units and returns", icon: "box", accent: "blue" },
    { id: "online-orders-report", label: "Online orders", detail: "Channels, fulfillment and status", icon: "globe", accent: "violet" },
    { id: "purchasing-report", label: "Purchasing", detail: "Supplier and purchase order activity", icon: "purchase", accent: "amber" },
    { id: "loyalty-report", label: "Loyalty", detail: "Visits, members and points", icon: "gift", accent: "green" },
    { id: "gift-card-report", label: "Gift cards", detail: "Issued value and remaining balance", icon: "card", accent: "orange" },
    { id: "expenses-report", label: "Expenses", detail: "Spend by category and period", icon: "wallet", accent: "slate" }
  ];
  var demoSettings = {
    storeName: "Adflare Market",
    address: "Main Street, Sample District",
    phone: "+960 700 0100",
    email: "hello@adflare.example",
    currency: "MVR",
    timezone: "Indian/Maldives",
    skuPrefix: "AF",
    defaultUnit: "each",
    allowNegativeStock: false,
    lowStockThreshold: 10,
    trackStock: true,
    valuationMethod: "Average cost",
    requireApproval: true,
    autoReceive: false,
    poPrefix: "PO",
    defaultLeadTime: 4,
    pointsPerUnit: 1,
    redemptionValue: 5,
    enabled: true,
    defaultExpiry: 12,
    minimumValue: 100,
    allowPartialRedemption: true,
    autoAccept: false,
    defaultFulfillment: "Pickup",
    approvalLimit: 500,
    requireReceipt: true,
    cashEnabled: true,
    cardEnabled: true,
    transferEnabled: true,
    creditEnabled: true,
    taxRate: 8,
    pricesIncludeTax: true,
    serviceFee: 0,
    storeUrl: "https://shop.adflare.example",
    syncInventory: true,
    orderNotifications: true
  };

  // ../pos/src/lib/util.js
  var DAY = 864e5;
  var esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  var clone = (value) => JSON.parse(JSON.stringify(value));
  var num = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };
  var round2 = (value) => Math.round((num(value) + Number.EPSILON) * 100) / 100;
  var toLabel = (key) => String(key).replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
  var startOfDay = (ts) => {
    const d2 = new Date(ts);
    d2.setHours(0, 0, 0, 0);
    return d2.getTime();
  };
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function fmtTime(ts) {
    const d2 = new Date(ts);
    let h = d2.getHours();
    const m = String(d2.getMinutes()).padStart(2, "0");
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ap}`;
  }
  function fmtDate(ts, withTime = true) {
    if (ts == null || ts === "") return "\u2014";
    if (typeof ts === "string" && Number.isNaN(Number(ts))) return ts;
    const t = Number(ts);
    const today = startOfDay(Date.now());
    const day = startOfDay(t);
    const time = withTime ? `, ${fmtTime(t)}` : "";
    if (day === today) return withTime ? `Today${time}` : "Today";
    if (day === today - DAY) return withTime ? `Yesterday${time}` : "Yesterday";
    const d2 = new Date(t);
    const year = d2.getFullYear();
    const base = `${MONTHS[d2.getMonth()]} ${d2.getDate()}`;
    if (!withTime) return `${base}, ${year}`;
    return year === (/* @__PURE__ */ new Date()).getFullYear() ? `${base}${time}` : `${base}, ${year}`;
  }
  var toInputDate = (ts) => {
    if (!ts) return "";
    const d2 = new Date(Number(ts));
    return `${d2.getFullYear()}-${String(d2.getMonth() + 1).padStart(2, "0")}-${String(d2.getDate()).padStart(2, "0")}`;
  };
  var fromInputDate = (str) => {
    if (!str) return null;
    const [y, m, d2] = String(str).split("-").map(Number);
    if (!y) return null;
    return new Date(y, m - 1, d2, 12, 0, 0).getTime();
  };
  var addMonths = (ts, months) => {
    const d2 = new Date(ts);
    d2.setMonth(d2.getMonth() + months);
    return d2.getTime();
  };
  function parseLabel(label, nowTs = Date.now()) {
    if (typeof label === "number") return label;
    if (label == null) return null;
    const text = String(label).trim();
    if (!text || text === "\u2014") return null;
    const clock = (h, m2, ap) => {
      let hh = Number(h) % 12;
      if (/pm/i.test(ap)) hh += 12;
      return [hh, Number(m2)];
    };
    let m = text.match(/^(today|yesterday)(?:,\s*(\d{1,2}):(\d{2})\s*(AM|PM))?$/i);
    if (m) {
      const base = startOfDay(nowTs) - (m[1].toLowerCase() === "yesterday" ? DAY : 0);
      const [h, mm] = m[2] ? clock(m[2], m[3], m[4]) : [12, 0];
      return base + (h * 60 + mm) * 6e4;
    }
    m = text.match(/^([A-Za-z]{3})\s+(\d{1,2})(?:,\s*(\d{4}))?(?:,\s*(\d{1,2}):(\d{2})\s*(AM|PM))?$/);
    if (m) {
      const mi = MONTHS.findIndex((x) => x.toLowerCase() === m[1].toLowerCase());
      if (mi < 0) return null;
      const year = m[3] ? Number(m[3]) : new Date(nowTs).getFullYear();
      const [h, mm] = m[4] ? clock(m[4], m[5], m[6]) : [12, 0];
      return new Date(year, mi, Number(m[2]), h, mm).getTime();
    }
    const parsed = Date.parse(text);
    return Number.isNaN(parsed) ? null : parsed;
  }
  var PERIODS = ["Today", "This week", "Last 7 days", "This month", "Last month", "This quarter", "Year to date"];
  var TABLE_PERIODS = ["All time", "Today", "Last 7 days", "Last 30 days", "This month", "Last month", "This quarter", "Year to date"];
  function periodRange(period, nowTs = Date.now()) {
    const t0 = startOfDay(nowTs);
    const end = t0 + DAY;
    const d2 = new Date(t0);
    switch (period) {
      case "All time":
        return { start: 0, end: Infinity };
      case "Today":
        return { start: t0, end };
      case "This week":
        return { start: t0 - (d2.getDay() + 6) % 7 * DAY, end };
      case "Last 30 days":
        return { start: t0 - 29 * DAY, end };
      case "This month":
        return { start: new Date(d2.getFullYear(), d2.getMonth(), 1).getTime(), end };
      case "Last month":
        return { start: new Date(d2.getFullYear(), d2.getMonth() - 1, 1).getTime(), end: new Date(d2.getFullYear(), d2.getMonth(), 1).getTime() };
      case "This quarter":
        return { start: new Date(d2.getFullYear(), Math.floor(d2.getMonth() / 3) * 3, 1).getTime(), end };
      case "Year to date":
        return { start: new Date(d2.getFullYear(), 0, 1).getTime(), end };
      case "Last 7 days":
      default:
        return { start: t0 - 6 * DAY, end };
    }
  }
  var prevRange = (range) => ({ start: range.start - (range.end - range.start), end: range.start });
  var inRange = (ts, range) => ts != null && ts >= range.start && ts < range.end;
  function buckets(range) {
    const days = Math.max(1, Math.round((range.end - range.start) / DAY));
    const out = [];
    if (days <= 1) {
      for (let h = 8; h <= 21; h++) out.push({ label: h === 12 ? "12p" : h > 12 ? `${h - 12}p` : `${h}a`, start: range.start + h * 36e5, end: range.start + (h + 1) * 36e5 });
      out[0].start = range.start;
      out[out.length - 1].end = range.end;
      return out;
    }
    if (days <= 31) {
      for (let i = 0; i < days; i++) {
        const start = range.start + i * DAY;
        const d2 = new Date(start);
        out.push({ label: days <= 7 ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d2.getDay()] : `${MONTHS[d2.getMonth()]} ${d2.getDate()}`, start, end: start + DAY });
      }
      return out;
    }
    if (days <= 100) {
      for (let start = range.start; start < range.end; start += 7 * DAY) {
        const d2 = new Date(start);
        out.push({ label: `${MONTHS[d2.getMonth()]} ${d2.getDate()}`, start, end: Math.min(start + 7 * DAY, range.end) });
      }
      return out;
    }
    const first = new Date(range.start);
    for (let y = first.getFullYear(), m = first.getMonth(); ; m++) {
      const start = new Date(y, m, 1).getTime();
      if (start >= range.end) break;
      out.push({ label: MONTHS[new Date(start).getMonth()], start: Math.max(start, range.start), end: Math.min(new Date(y, m + 1, 1).getTime(), range.end) });
    }
    return out;
  }
  function pctChange(cur, prev) {
    if (!prev) return cur ? "new" : "\u2014";
    const v = (cur - prev) / prev * 100;
    return `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;
  }
  function rng(seed = 2026) {
    let a = seed >>> 0;
    const next = () => {
      a = a + 1831565813 >>> 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
    next.int = (min, max) => Math.floor(next() * (max - min + 1)) + min;
    next.pick = (list) => list[Math.floor(next() * list.length)];
    next.weighted = (list, weights) => {
      const total = weights.reduce((s, w) => s + w, 0);
      let r = next() * total;
      for (let i = 0; i < list.length; i++) {
        r -= weights[i];
        if (r <= 0) return list[i];
      }
      return list[list.length - 1];
    };
    return next;
  }
  function nextSeq(list, key = "id") {
    let max = 0;
    for (const row of list) {
      const m = String(row[key] ?? "").match(/(\d+)$/);
      if (m) max = Math.max(max, Number(m[1]));
    }
    return max + 1;
  }
  var makeId = (prefix, list, key = "id", pad2 = 5) => `${prefix}${String(nextSeq(list, key)).padStart(pad2, "0")}`;
  function csvEscape(value) {
    return `"${String(value ?? "").replaceAll('"', '""')}"`;
  }

  // ../pos/src/lib/seed.js
  var DATE_KEYS = {
    bills: ["date"],
    sessions: ["openedAt", "closedAt"],
    giftCards: ["issuedAt", "expires"],
    quotations: ["createdAt", "expires"],
    onlinePayments: ["submittedAt"],
    stockCounts: ["startedAt"],
    transfers: ["createdAt"],
    purchaseOrders: ["createdAt", "expectedAt"],
    receipts: ["receivedAt"],
    landedCosts: ["date"],
    onlineOrders: ["date"],
    expenses: ["date"],
    categories: ["updatedAt"]
  };
  var FUTURE_KEYS = /* @__PURE__ */ new Set(["expires", "expectedAt"]);
  var TAX = 8;
  var pad = (n, w = 5) => String(n).padStart(w, "0");
  function buildSeed(nowTs = Date.now()) {
    const src = clone(initialDemoData);
    const r = rng(2026);
    const today0 = startOfDay(nowTs);
    const year = new Date(nowTs).getFullYear();
    for (const [coll, keys] of Object.entries(DATE_KEYS)) {
      for (const row of src[coll] || []) {
        for (const key of keys) {
          let ts = parseLabel(row[key], nowTs);
          if (ts != null && !FUTURE_KEYS.has(key) && ts > nowTs) ts = nowTs - 6e4;
          row[key] = ts;
        }
      }
    }
    const products = src.products;
    const popularity = [5, 3, 4, 4, 1, 3, 3, 2];
    const customers = src.customers;
    customers.forEach((c, i) => {
      c.creditLimit = 3e3;
      c.joinedAt = nowTs - (i * 17 + 9) * DAY;
    });
    const makeLines = (maxLines = 4) => {
      const n = r.weighted([1, 2, 3, 4].slice(0, maxLines), [4, 4, 2, 1].slice(0, maxLines));
      const used = /* @__PURE__ */ new Set();
      const lines = [];
      for (let i = 0; i < n; i++) {
        const p = r.weighted(products, popularity);
        if (used.has(p.sku)) continue;
        used.add(p.sku);
        lines.push({ sku: p.sku, name: p.name, price: p.price, qty: r.weighted([1, 2, 3], [6, 3, 1]) });
      }
      return lines;
    };
    const linesForUnits = (units2) => {
      const lines = [];
      const used = /* @__PURE__ */ new Set();
      let left = Math.max(1, units2);
      while (left > 0) {
        const p = r.weighted(products, popularity);
        if (used.has(p.sku) && used.size < products.length) continue;
        used.add(p.sku);
        const qty = Math.min(left, r.int(1, 2));
        lines.push({ sku: p.sku, name: p.name, price: p.price, qty });
        left -= qty;
      }
      return lines;
    };
    const sum = (lines) => lines.reduce((s, l) => s + l.price * l.qty, 0);
    const units = (lines) => lines.reduce((s, l) => s + l.qty, 0);
    const generated = [];
    for (let off = 0; off < 40; off++) {
      const day = today0 - off * DAY;
      const dow = new Date(day).getDay();
      let count = 11 + (dow === 5 || dow === 6 ? 6 : 0) + r.int(0, 8);
      let start = day + 8 * 36e5;
      let end = day + 20 * 36e5;
      if (off === 0) {
        const frac = Math.min(1, Math.max(0.15, (nowTs - start) / (12 * 36e5)));
        count = Math.max(4, Math.round(count * frac));
        if (nowTs < start + 30 * 6e4) {
          start = day;
        }
        end = Math.min(nowTs - 1e3, end);
      }
      for (let i = 0; i < count; i++) {
        const ts = Math.floor(start + r() * Math.max(6e4, end - start));
        const lines = makeLines();
        const method = r.weighted(["Card", "Cash", "Transfer", "Credit"], [42, 34, 18, 6]);
        let customer = r() < 0.38 ? r.pick(customers).name : "Walk-in customer";
        if (method === "Credit" && customer === "Walk-in customer") customer = r.pick(customers).name;
        const roll = r();
        let status = "Completed";
        if (method === "Credit" && r() < 0.4) status = "Pending";
        else if (roll < 0.03) status = "Voided";
        else if (roll < 0.045 && off > 0) status = "Refunded";
        const total = round2(sum(lines));
        generated.push({
          date: ts,
          customer,
          items: units(lines),
          method,
          subtotal: total,
          discount: 0,
          tax: round2(total * TAX / (100 + TAX)),
          total,
          outlet: r.weighted(["Main branch", "Branch 1"], [68, 32]),
          status,
          lines,
          sessionId: null,
          note: ""
        });
      }
    }
    generated.sort((a, b) => b.date - a.date);
    const openSessionId = "SES-00814";
    generated.forEach((bill, i) => {
      bill.id = `AF-${year}-${pad(1842 - i)}`;
      const seedRow = src.bills[i];
      if (seedRow) {
        bill.customer = seedRow.customer;
        bill.method = seedRow.method;
        bill.status = seedRow.status;
      }
      if (bill.method === "Credit" && bill.customer === "Walk-in customer") bill.customer = customers[0].name;
      if (bill.date >= today0 && bill.outlet === "Main branch" && bill.status !== "Voided") bill.sessionId = openSessionId;
    });
    src.bills = generated;
    src.sessions.forEach((s) => {
      s.outlet = s.register === "Branch 1 counter" ? "Branch 1" : "Main branch";
      s.openingFloat = 1500;
      s.cashIn = 0;
      s.cashOut = 0;
      const v = Number(s.variance);
      s.variance = Number.isFinite(v) && s.variance !== "\u2014" ? v : null;
      s.counted = s.status === "Closed" && s.variance != null ? s.expectedCash + s.variance : null;
      s.activity = [];
    });
    const live = src.sessions[0];
    live.openedAt = Math.min(live.openedAt, nowTs - 5 * 6e4);
    if (live.openedAt < today0) live.openedAt = today0;
    live.expectedCash = null;
    live.closedAt = null;
    live.activity = [{ ts: live.openedAt, text: "Register opened", amount: 1500, tone: "green" }];
    src.bills.forEach((b) => {
      if (b.sessionId === openSessionId && b.date < live.openedAt) b.sessionId = null;
    });
    src.quotations.forEach((q) => {
      q.lines = linesForUnits(q.items);
      q.items = units(q.lines);
      q.total = round2(sum(q.lines));
      q.note = q.note || "";
    });
    const payments = src.onlinePayments;
    src.onlineOrders.forEach((o) => {
      o.lines = linesForUnits(o.items);
      o.items = units(o.lines);
      o.total = round2(sum(o.lines));
      const pay = payments.find((p) => p.order === o.id);
      if (pay) {
        pay.amount = o.total;
        pay.customer = o.customer;
      }
    });
    const channels = ["Web store", "Instagram", "Marketplace"];
    for (let i = 0; i < 26; i++) {
      const age = r.int(1, 38);
      const ts = today0 - age * DAY + r.int(9, 19) * 36e5;
      const lines = linesForUnits(r.int(2, 6));
      const id = `ON-${pad(4378 - i, 5)}`;
      const cancelled = r() < 0.08;
      const status = cancelled ? "Cancelled" : age <= 2 ? r.pick(["Processing", "Ready to ship"]) : "Completed";
      const customer = r.pick(customers).name;
      const method = r() < 0.5 ? "Card" : "Bank transfer";
      src.onlineOrders.push({ id, channel: r.pick(channels), customer, date: ts, items: units(lines), total: round2(sum(lines)), outlet: r.pick(["Main branch", "Branch 1"]), status, lines });
      payments.push({ id: `PAY-${pad(9008 - i, 5)}`, order: id, customer, method, submittedAt: ts, amount: round2(sum(lines)), status: cancelled ? "Rejected" : "Approved" });
    }
    src.onlineOrders.sort((a, b) => b.date - a.date);
    payments.sort((a, b) => b.submittedAt - a.submittedAt);
    const pos = src.purchaseOrders;
    const received = { "PO-00984": 0, "PO-00983": 3, "PO-00982": 16 };
    pos.forEach((p) => {
      p.receivedUnits = received[p.id] ?? p.items;
    });
    const supplierNames = src.suppliers.map((s) => s.name);
    for (let i = 0; i < 5; i++) {
      const created = today0 - (9 + i * 11) * DAY;
      const items = r.int(6, 20);
      pos.push({ id: `PO-${pad(981 - i, 5)}`, supplier: r.pick(supplierNames.slice(0, 3)), createdAt: created + 10 * 36e5, expectedAt: created + 4 * DAY, items, receivedUnits: items, total: r.int(40, 200) * 100, outlet: "Main branch", status: "Received" });
    }
    const gcs = src.giftCards;
    for (let i = 0; i < 3; i++) {
      const issued = today0 - (14 + i * 9) * DAY;
      gcs.push({ code: `GC-${pad(4808 - i, 6)}`, customer: r.pick(customers).name, issuedAt: issued, balance: i === 1 ? 0 : [300, 0, 750][i], expires: issued + 365 * DAY, status: i === 1 ? "Redeemed" : "Active", value: [300, 400, 750][i] });
    }
    gcs.forEach((g) => {
      if (g.value == null) g.value = g.balance === 0 ? 500 : g.balance;
    });
    const expenseSets = {
      Utilities: [["Electricity bill", "STELCO", 1650], ["Water bill", "MWSC", 380], ["Monthly internet", "FiberNet", 1200]],
      "Store supplies": [["Cleaning supplies", "Office Corner", 260], ["Shelf labels", "Print House", 190], ["Packaging tape", "Office Corner", 140]],
      Transport: [["Delivery fuel", "M. Santos", 520], ["Courier fee", "Island Express", 330]],
      Marketing: [["Social media ads", "Meta", 900], ["Flyer print", "Print House", 640]]
    };
    const cats = Object.keys(expenseSets);
    for (let i = 0; i < 22; i++) {
      const cat = cats[i % cats.length];
      const [description, payee, amount] = r.pick(expenseSets[cat]);
      src.expenses.push({ date: today0 - r.int(2, 58) * DAY + r.int(9, 17) * 36e5, category: cat, description, payee, method: r.pick(["Cash", "Transfer", "Card"]), amount: amount + r.int(0, 8) * 10, status: "Approved", receipt: "" });
    }
    src.expenses.forEach((e) => {
      e.receipt = e.receipt || "";
    });
    src.expenses.sort((a, b) => b.date - a.date);
    src.receipts.forEach((x) => {
      x.note = x.note || "";
    });
    delete src.orderProducts;
    src.activity = [];
    src.seededAt = nowTs;
    return src;
  }

  // ../pos/src/lib/icons.js
  var iconPaths = {
    trash: '<path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v6m4-6v6"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16v4Zm9.5-13.5 4 4"/>',
    print: '<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/>',
    undo: '<path d="M9 7 4 12l5 5M4 12h10a6 6 0 0 1 0 12"/>',
    ban: '<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
    minus: '<path d="M5 12h14"/>',
    upload: '<path d="M12 21V9m-5 5 5-5 5 5M4 7V3h16v4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    alert: '<path d="M12 4 2.5 20h19L12 4Z"/><path d="M12 10v4m0 3h.01"/>',
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-6h-4v6H4a1 1 0 0 1-1-1z"/>',
    cart: '<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M2 3h2l2.6 12.2a2 2 0 0 0 2 1.6h9.6a2 2 0 0 0 2-1.6L22 8H5"/>',
    cash: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M7 9h.01M17 15h.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    gift: '<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M12 9v12M3 13h18M12 9H7.5a2.5 2.5 0 1 1 2.5-2.5V9Zm0 0h4.5A2.5 2.5 0 1 0 14 6.5V9Z"/>',
    quote: '<path d="M10 11H5a2 2 0 0 0-2 2v6h7v-8Zm11 0h-5a2 2 0 0 0-2 2v6h7v-8ZM10 11c0-4-2-6-6-7m17 7c0-4-2-6-6-7"/>',
    card: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M3 10h18M7 15h4"/>',
    receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6m-6 4h6m-6 4h3"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-1a6 6 0 0 1 12 0v1H3Zm13-9a3 3 0 1 0-1-5.8M17 14a5 5 0 0 1 4 5v1h-3"/>',
    box: '<path d="m12 3 9 4.5v9L12 21l-9-4.5v-9L12 3Z"/><path d="m3.5 7.7 8.5 4.4 8.5-4.4M12 12v9"/>',
    layers: '<path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z"/><path d="m3 12 9 4.5 9-4.5M3 16.5 12 21l9-4.5"/>',
    inventory: '<path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z"/><path d="M4.5 7.8 12 12l7.5-4.2M12 12v9M8 5.2l8 4.5"/>',
    checklist: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M8 10h8M8 14h8M8 18h5"/>',
    transfer: '<path d="M4 7h14l-3-3m5 13H6l3 3"/><path d="M18 7l2 2-2 2M6 13l-2 2 2 2"/>',
    truck: '<path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
    purchase: '<path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h4"/><path d="M17 3v4"/>',
    coins: '<circle cx="9" cy="9" r="6"/><path d="M9 6v6m-2-4h4m3 8a6 6 0 0 0 9-5m-10 9a6 6 0 0 0 8-4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
    tag: '<path d="M3 12V4h8l10 10-7 7L3 12Z"/><circle cx="8" cy="8" r="1"/>',
    wallet: '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 8h18m-6 6h3"/>',
    folder: '<path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z"/><path d="M3 9h18"/>',
    report: '<path d="M5 20V11M10 20V5M15 20v-7M20 20H3"/>',
    chart: '<path d="M4 19V5m0 14h17"/><path d="m7 15 4-4 3 2 5-6"/><circle cx="19" cy="7" r="1"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a7 7 0 0 1-1.6.9l-.3 1.8h-2.8l-.3-1.8a7 7 0 0 1-1.6-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.9l-1.4-1.1 1.4-2.4 1.7.7a7 7 0 0 1 1.6-.9l.3-1.8h2.8l.3 1.8a7 7 0 0 1 1.6.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.9Z" transform="translate(-1 -1)"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
    bell: '<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 12h4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    dots: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    filter: '<path d="M4 6h16M7 12h10m-7 6h4"/>',
    refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9a7 7 0 0 1 11.8-2L20 12M4 12l2.6 5a7 7 0 0 0 11.8-2"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
    logout: '<path d="M10 17l5-5-5-5m5 5H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>'
  };
  var svgIcon = (name, size = 18) => `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.box}</svg>`;

  // ../pos/src/lib/core.js
  var STORAGE_KEY = "afpos-data-v2";
  function setUser(email) {
    state.user = email;
    STORAGE_KEY = `afpos-data-v2:${email}`;
  }
  var USD_RATE = 15.42;
  var state = {
    view: "home",
    user: "",
    data: null,
    settings: null,
    // table UI
    query: "",
    statusFilter: "all",
    tablePeriod: "All time",
    sort: { key: null, dir: 1 },
    page: 0,
    pageSize: 10,
    // sell
    cart: [],
    cartCustomer: "Walk-in customer",
    cartDiscount: "",
    cartDiscountType: "amount",
    redeemPoints: false,
    cartQuote: null,
    productQuery: "",
    productCategory: "all",
    inStockOnly: false,
    // chrome
    modal: null,
    mobileNav: false,
    outlet: "All branches",
    outletMenuOpen: false,
    period: "Last 7 days",
    chartMetric: "sales",
    popover: null,
    gq: "",
    notifSeen: "",
    modalReturnSelector: null,
    restoreFocusSelector: null
  };
  var hooks = { render: () => {
  }, renderTable: () => {
  } };
  var render = () => hooks.render();
  function migrateBranches(node) {
    const RENAME = { 'Main store': 'Main branch', 'Studio kiosk': 'Branch 1', 'Pop-up booth': 'Branch 2' };
    if (Array.isArray(node)) { node.forEach(migrateBranches); return; }
    if (!node || typeof node !== 'object') return;
    Object.keys(node).forEach((k) => {
      const v = node[k];
      if (typeof v === 'string') {
        if (k === 'register' && v === 'Studio kiosk') node[k] = 'Branch 1 counter';
        else if ((k === 'outlet' || k === 'from' || k === 'to') && RENAME[v]) node[k] = RENAME[v];
      } else migrateBranches(v);
    });
  }

  function applyPersisted(saved) {
    migrateBranches(saved.data);
    state.data = saved.data;
    state.settings = { ...clone(demoSettings), ...saved.settings || {} };
    state.cart = saved.cart || [];
    state.cartCustomer = saved.cartCustomer || "Walk-in customer";
    const OLD_BRANCH = { 'Main store': 'Main branch', 'Studio kiosk': 'Branch 1', 'Pop-up booth': 'Branch 2' };
    state.outlet = !saved.outlet || saved.outlet === 'All outlets' || saved.outlet === 'All shops' ? 'All branches' : (OLD_BRANCH[saved.outlet] || saved.outlet);
    state.period = saved.period || "Last 7 days";
    state.notifSeen = saved.notifSeen || "";
  }
  function initState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && saved.v === 2 && saved.data && saved.data.bills) applyPersisted(saved);
      }
    } catch (error) {
    }
    if (!state.data) resetData();
    window.addEventListener("beforeunload", flush);
  }
  function resetData() {
    state.data = buildSeed();
    state.settings = clone(demoSettings);
    state.cart = [];
    state.cartCustomer = "Walk-in customer";
    state.cartQuote = null;
    state.cartDiscount = "";
    state.notifSeen = "";
    flush();
  }
  var timer;
  function save() {
    clearTimeout(timer);
    timer = setTimeout(flush, 120);
  }
  function flush() {
    clearTimeout(timer);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 2, data: state.data, settings: state.settings, cart: state.cart, cartCustomer: state.cartCustomer, outlet: state.outlet, period: state.period, notifSeen: state.notifSeen }));
    } catch (error) {
    }
  }
  function money(value) {
    const usd = state.settings?.currency === "USD";
    const n = Number(value || 0) / (usd ? USD_RATE : 1);
    return `${usd ? "USD" : "MVR"} ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  var moneyShort = (value) => {
    const usd = state.settings?.currency === "USD";
    const n = Number(value || 0) / (usd ? USD_RATE : 1);
    const abs = Math.abs(n);
    const body = abs >= 1e3 ? `${(n / 1e3).toFixed(abs >= 1e4 ? 0 : 1).replace(/\.0$/, "")}k` : String(Math.round(n));
    return `${usd ? "USD" : "MVR"} ${body}`;
  };
  var signed = (value) => `${Number(value) > 0 ? "+" : ""}${Number(value || 0).toLocaleString("en-US")}`;
  function statusClass(status) {
    const value = String(status || "").toLowerCase();
    if (/(complete|approved|active|received|in stock|on track|^open$|converted|ready|redeemed)/.test(value)) return "status-good";
    if (/(review|pending|progress|await|low|draft|over budget|transit|processing|part)/.test(value)) return "status-warn";
    if (/(void|cancel|reject|out of stock|expired|hold|closed|refund|blocked|archived)/.test(value)) return "status-bad";
    return "status-neutral";
  }
  var toastTimer;
  function toast(message, tone = "ok") {
    const app2 = document.querySelector("#app");
    if (!app2) return;
    let el = app2.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      app2.append(el);
    }
    el.classList.toggle("toast-warn", tone === "warn");
    el.innerHTML = `${svgIcon(tone === "warn" ? "info" : "check", 16)}<span>${esc(message)}</span>`;
    requestAnimationFrame(() => el.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 250);
    }, 2600);
  }
  var openSession = () => state.data.sessions.find((s) => s.status === "Open") || null;
  var outletMatches = (row) => state.outlet === "All branches" || !row.outlet || row.outlet === state.outlet;
  function logActivity(text, tone = "blue", view = null) {
    state.data.activity = state.data.activity || [];
    state.data.activity.unshift({ ts: Date.now(), text, tone, view });
    state.data.activity.length = Math.min(state.data.activity.length, 40);
  }
  function productStatus(product) {
    const qty = Number(product.stockQty || 0);
    if (qty <= 0) return "Out of stock";
    if (qty <= Number(state.settings.lowStockThreshold ?? 10)) return "Low stock";
    return "In stock";
  }
  var syncProductStatus = (product) => {
    product.status = productStatus(product);
  };
  function go(view) {
    if (!pageMeta[view]) return;
    state.view = view;
    state.modal = null;
    state.query = "";
    state.statusFilter = "all";
    state.page = 0;
    state.sort = { key: null, dir: 1 };
    state.tablePeriod = "All time";
    state.mobileNav = false;
    state.popover = null;
    state.gq = "";
    render();
    try {
      history.replaceState(null, "", `#${encodeURIComponent(view)}`);
    } catch (e) {
    }
    window.scrollTo?.(0, 0);
  }

  // ../pos/src/lib/config.js
  var DATE_COLS = /* @__PURE__ */ new Set(["date", "createdAt", "issuedAt", "submittedAt", "openedAt", "closedAt", "startedAt", "receivedAt", "updatedAt", "expires", "expectedAt", "joinedAt"]);
  var DATE_ONLY = (dataKey, key) => key === "expires" || key === "expectedAt" || dataKey === "landedCosts" && key === "date";
  var MONEY_COLS = /* @__PURE__ */ new Set(["total", "amount", "balance", "outstanding", "price", "revenue", "expectedCash", "freight", "duties", "other", "budget", "monthToDate", "openingFloat", "counted", "creditLimit"]);
  var OUTLETS = ["Main branch", "Branch 1", "Branch 2"];
  var STATUS_OPTIONS = {
    products: ["In stock", "Low stock", "Out of stock"],
    customers: ["Active", "Review", "Blocked"],
    categories: ["Active", "Archived"],
    giftCards: ["Active", "Redeemed", "Cancelled", "Expired"],
    quotations: ["Open", "Converted", "Expired", "Cancelled"],
    onlinePayments: ["Review", "Approved", "Rejected"],
    bills: ["Completed", "Pending", "Voided", "Refunded"],
    sessions: ["Open", "Closed"],
    stockCounts: ["In progress", "Completed"],
    transfers: ["Draft", "Approved", "In transit", "Received", "Cancelled"],
    suppliers: ["Active", "On hold"],
    purchaseOrders: ["Pending approval", "Awaiting delivery", "Part received", "Received", "Cancelled"],
    onlineOrders: ["Payment review", "Processing", "Ready to ship", "Completed", "Cancelled"],
    expenses: ["Review", "Approved", "Rejected"],
    expenseCategories: ["On track", "Over budget"]
  };
  var EDITABLE = /* @__PURE__ */ new Set(["customers", "products", "categories", "giftCards", "quotations", "suppliers", "purchaseOrders", "landedCosts", "expenses", "expenseCategories", "stockCounts", "transfers"]);
  var DELETABLE = EDITABLE;
  var EDIT_STATUS = /* @__PURE__ */ new Set(["customers", "categories", "suppliers", "giftCards", "quotations"]);
  var NAME_KEY = { customers: "name", products: "sku", categories: "name", giftCards: "code", suppliers: "name", expenseCategories: "name" };
  var f = (name, label, type = "text", required = false, extra = {}) => ({ name, label, type, required, ...extra });
  var names = (list, key = "name") => list.map((x) => x[key]);
  var enabledMethods = () => ["Cash", "Card", "Transfer", "Credit"].filter((m) => state.settings[{ Cash: "cashEnabled", Card: "cardEnabled", Transfer: "transferEnabled", Credit: "creditEnabled" }[m]] !== false);
  function getFields(key, row) {
    const d2 = state.data;
    const s = state.settings;
    const edit = Boolean(row);
    const val = (name, fallback = "") => edit ? row[name] ?? fallback : fallback;
    const date = (name, fallbackTs) => edit ? toInputDate(row[name]) : fallbackTs ? toInputDate(fallbackTs) : "";
    const status = () => edit && EDIT_STATUS.has(key) ? [f("status", "Status", "select", true, { options: STATUS_OPTIONS[key], value: row.status })] : [];
    const now = Date.now();
    const customers = ["Walk-in customer", ...names(d2.customers)];
    switch (key) {
      case "customers":
        return [f("name", "Customer name", "text", true, { value: val("name") }), f("mobile", "Phone", "tel", false, { value: val("mobile") }), f("email", "Email", "email", false, { value: val("email") }), f("address", "Address", "text", false, { value: val("address") }), f("loyalty", "Loyalty points", "number", false, { value: val("loyalty", 0), min: 0 }), f("creditLimit", "Credit limit (MVR)", "number", false, { value: val("creditLimit", 3e3), min: 0 }), ...status()];
      case "products":
        return [f("sku", "SKU", "text", true, { value: val("sku", `${s.skuPrefix || "AF"}-${1001 + d2.products.length}`) }), f("name", "Product name", "text", true, { value: val("name") }), f("category", "Category", "select", true, { options: names(d2.categories), value: val("category", d2.categories[0]?.name) }), f("stockQty", edit ? "On hand" : "Opening stock", "number", true, { value: val("stockQty", 0), min: 0, step: 1 }), f("price", "Price (MVR)", "number", true, { value: val("price"), min: 0, step: "any" })];
      case "categories":
        return [f("name", "Category name", "text", true, { value: val("name") }), f("description", "Description", "text", false, { value: val("description") }), ...status()];
      case "giftCards":
        return [f("code", "Card number", "text", true, { value: val("code", `GC-${String(Math.floor(now / 1e3) % 1e6).padStart(6, "0")}`) }), f("customer", "Customer", "select", false, { options: customers, value: val("customer", "Walk-in customer") }), f("balance", edit ? "Balance" : "Initial value", "number", true, { value: val("balance", s.minimumValue || 100), min: 0, step: "any" }), f("expires", "Expires", "date", false, { value: date("expires", addMonths(now, Number(s.defaultExpiry || 12))) }), ...status()];
      case "quotations":
        return [f("customer", "Customer", "select", true, { options: customers, value: val("customer", "Walk-in customer") }), f("items", "Units", "number", true, { value: val("items", 1), min: 1, step: 1 }), f("total", "Total", "number", true, { value: val("total"), min: 0, step: "any" }), f("expires", "Valid until", "date", false, { value: date("expires", now + 7 * DAY) }), f("note", "Notes", "text", false, { value: val("note"), span: true }), ...status()];
      case "stockCounts":
        return [f("outlet", "Branch", "select", true, { options: OUTLETS, value: val("outlet", "Main branch") }), f("scope", "Count scope", "text", true, { value: val("scope", "All products") }), f("startedAt", "Start date", "date", true, { value: date("startedAt", now) })];
      case "transfers":
        return [f("from", "From branch", "select", true, { options: OUTLETS, value: val("from", "Main branch") }), f("to", "To branch", "select", true, { options: OUTLETS, value: val("to", "Branch 1") }), f("items", "Number of items", "number", true, { value: val("items", 1), min: 1, step: 1 }), f("note", "Note", "text", false, { value: val("note") })];
      case "suppliers":
        return [f("name", "Supplier name", "text", true, { value: val("name") }), f("contact", "Contact name", "text", false, { value: val("contact") }), f("email", "Email", "email", false, { value: val("email") }), f("phone", "Phone", "tel", false, { value: val("phone") }), f("leadTime", "Lead time (days)", "number", false, { value: String(val("leadTime", s.defaultLeadTime || 4)).replace(/\D/g, ""), min: 0, step: 1 }), ...status()];
      case "purchaseOrders":
        return [f("supplier", "Supplier", "select", true, { options: names(d2.suppliers), value: val("supplier", d2.suppliers[0]?.name) }), f("expectedAt", "Expected date", "date", false, { value: date("expectedAt", now + Number(s.defaultLeadTime || 4) * DAY) }), f("items", "Units ordered", "number", true, { value: val("items", 10), min: 1, step: 1 }), f("total", "Estimated total", "number", true, { value: val("total"), min: 0, step: "any" })];
      case "landedCosts":
        return [f("purchaseOrder", "Purchase order", "select", true, { options: names(d2.purchaseOrders, "id"), value: val("purchaseOrder", d2.purchaseOrders[0]?.id) }), f("freight", "Freight", "number", true, { value: val("freight", 0), min: 0, step: "any" }), f("duties", "Duties", "number", false, { value: val("duties", 0), min: 0, step: "any" }), f("other", "Other costs", "number", false, { value: val("other", 0), min: 0, step: "any" }), f("date", "Date", "date", false, { value: date("date", now) })];
      case "expenses":
        return [f("date", "Date", "date", true, { value: date("date", now) }), f("category", "Category", "select", true, { options: names(d2.expenseCategories), value: val("category", d2.expenseCategories[0]?.name) }), f("description", "Description", "text", true, { value: val("description") }), f("payee", "Payee", "text", false, { value: val("payee") }), f("amount", "Amount (MVR)", "number", true, { value: val("amount"), min: 0, step: "any" }), f("method", "Payment method", "select", false, { options: enabledMethods(), value: val("method", "Cash") }), f("receipt", `Receipt reference${s.requireReceipt ? ` (required above MVR ${s.approvalLimit})` : ""}`, "text", false, { value: val("receipt"), span: true })];
      case "expenseCategories":
        return [f("name", "Category name", "text", true, { value: val("name") }), f("budget", "Monthly budget (MVR)", "number", false, { value: val("budget", 0), min: 0, step: "any" })];
      default:
        return [];
    }
  }
  var CREATE_LABEL = { customers: "Add customer", products: "Add product", categories: "Add category", giftCards: "Issue gift card", quotations: "New quotation", stockCounts: "Start stock count", transfers: "New transfer", suppliers: "Add supplier", purchaseOrders: "Create purchase order", landedCosts: "Add landed cost", expenses: "New expense", expenseCategories: "Add category" };

  // ../pos/src/lib/selectors.js
  var isSale = (b) => b.status === "Completed" || b.status === "Pending";
  var sumBy = (rows, fn) => round2(rows.reduce((s, r) => s + Number(fn(r) || 0), 0));
  var sumTotal = (rows) => sumBy(rows, (r) => r.total);
  var DATE_FIELD = {
    bills: "date",
    sessions: "openedAt",
    giftCards: "issuedAt",
    quotations: "createdAt",
    onlinePayments: "submittedAt",
    stockCounts: "startedAt",
    transfers: "createdAt",
    purchaseOrders: "createdAt",
    landedCosts: "date",
    onlineOrders: "date",
    expenses: "date",
    receipts: "receivedAt",
    customers: "joinedAt"
  };
  var billsIn = (range, useOutlet = true) => state.data.bills.filter((b) => inRange(b.date, range) && (!useOutlet || outletMatches(b)));
  var ordersIn = (range) => state.data.onlineOrders.filter((o) => inRange(o.date, range) && outletMatches(o));
  function homeMetrics() {
    const range = periodRange(state.period);
    const prev = prevRange(range);
    const cur = billsIn(range);
    const prv = billsIn(prev);
    const sales = cur.filter(isSale);
    const prevSales = prv.filter(isSale);
    const net = sumTotal(sales);
    const prevNet = sumTotal(prevSales);
    const mtdRange = periodRange("This month");
    const elapsed = mtdRange.end - mtdRange.start;
    const lastMonth = periodRange("Last month");
    const mtd = sumTotal(billsIn(mtdRange).filter(isSale));
    const lmSame = sumTotal(billsIn({ start: lastMonth.start, end: lastMonth.start + elapsed }).filter(isSale));
    const units = sales.reduce((s, b) => s + Number(b.items || 0), 0);
    const prevUnits = prevSales.reduce((s, b) => s + Number(b.items || 0), 0);
    const refunds = cur.filter((b) => b.status === "Refunded");
    const voids = cur.filter((b) => b.status === "Voided");
    const owing = state.data.customers.filter((c) => Number(c.outstanding) > 0);
    const joined = state.data.customers.filter((c) => inRange(c.joinedAt, mtdRange)).length;
    return {
      range,
      net,
      prevNet,
      netChange: pctChange(net, prevNet),
      count: sales.length,
      countChange: pctChange(sales.length, prevSales.length),
      mtd,
      mtdChange: pctChange(mtd, lmSame),
      outstanding: sumBy(owing, (c) => c.outstanding),
      owingCount: owing.length,
      customers: state.data.customers.length,
      joined,
      units,
      unitsChange: pctChange(units, prevUnits),
      refundAmount: sumTotal(refunds),
      refundCount: refunds.length,
      voidCount: voids.length,
      voidAmount: sumTotal(voids)
    };
  }
  function bucketSeries(rows, dateOf, valueOf, range) {
    const bks = buckets(range);
    const values = bks.map(() => 0);
    rows.forEach((row) => {
      const ts = dateOf(row);
      const i = bks.findIndex((b) => ts >= b.start && ts < b.end);
      if (i >= 0) values[i] += Number(valueOf(row) || 0);
    });
    return bks.map((b, i) => ({ label: b.label, value: round2(values[i]) }));
  }
  function salesSeries(range, metric = "sales") {
    const sales = billsIn(range).filter(isSale);
    if (metric === "count") return bucketSeries(sales, (b) => b.date, () => 1, range);
    if (metric === "average") {
      const total = bucketSeries(sales, (b) => b.date, (b) => b.total, range);
      const count = bucketSeries(sales, (b) => b.date, () => 1, range);
      return total.map((p, i) => ({ label: p.label, value: count[i].value ? round2(p.value / count[i].value) : 0 }));
    }
    return bucketSeries(sales, (b) => b.date, (b) => b.total, range);
  }
  function productPerformance(range) {
    const prev = prevRange(range);
    const map = /* @__PURE__ */ new Map();
    const add = (line, ts, orderKey, returned, where) => {
      const cur = inRange(ts, range);
      const pr = inRange(ts, prev);
      if (!cur && !pr) return;
      const entry = map.get(line.name) || { name: line.name, sku: line.sku, orderKeys: /* @__PURE__ */ new Set(), quantity: 0, revenue: 0, returns: 0, prevQty: 0 };
      if (cur) {
        entry.orderKeys.add(orderKey);
        if (returned) entry.returns += line.qty;
        else {
          entry.quantity += line.qty;
          entry.revenue += line.price * line.qty;
        }
      } else if (!returned) entry.prevQty += line.qty;
      map.set(line.name, entry);
    };
    state.data.bills.forEach((b) => {
      if (!outletMatches(b)) return;
      if (isSale(b)) (b.lines || []).forEach((l) => add(l, b.date, b.id, false));
      else if (b.status === "Refunded") (b.lines || []).forEach((l) => add(l, b.date, b.id, true));
    });
    state.data.onlineOrders.forEach((o) => {
      if (!outletMatches(o) || o.status === "Cancelled") return;
      (o.lines || []).forEach((l) => add(l, o.date, o.id, false));
    });
    return [...map.values()].map((e) => {
      const change = e.prevQty ? (e.quantity - e.prevQty) / e.prevQty : e.quantity ? 1 : 0;
      return { name: e.name, sku: e.sku, orders: e.orderKeys.size, quantity: e.quantity, revenue: round2(e.revenue), returns: e.returns, status: change > 0.1 ? "Trending up" : change < -0.1 ? "Trending down" : "Steady" };
    }).sort((a, b) => b.revenue - a.revenue);
  }
  var sessionStats = (s) => {
    const bills = state.data.bills.filter((b) => b.sessionId === s.id && isSale(b));
    const cash = sumBy(bills.filter((b) => b.method === "Cash"), (b) => b.total);
    const card = sumBy(bills.filter((b) => b.method === "Card"), (b) => b.total);
    const other = sumBy(bills.filter((b) => b.method !== "Cash" && b.method !== "Card"), (b) => b.total);
    const expected = round2(Number(s.openingFloat || 0) + cash + Number(s.cashIn || 0) - Number(s.cashOut || 0));
    return { sales: round2(cash + card + other), cash, card, other, expected, count: bills.length };
  };
  function getRows(dataKey) {
    const d2 = state.data;
    if (dataKey === "orderProducts") return productPerformance(periodRange(state.period)).map((row, i) => ({ row, index: -1, key: i }));
    const list = d2[dataKey] || [];
    return list.map((row, index) => {
      let view = row;
      if (dataKey === "suppliers") view = { ...row, openOrders: d2.purchaseOrders.filter((p) => p.supplier === row.name && !["Received", "Cancelled"].includes(p.status)).length, leadTime: `${row.leadTime || 0} days`.replace(/ days days$/, " days") };
      else if (dataKey === "categories") view = { ...row, products: d2.products.filter((p) => p.category === row.name).length };
      else if (dataKey === "expenseCategories") {
        const v = round2(Number(row.monthToDate || 0) - Number(row.budget || 0));
        view = { ...row, variance: v, status: v > 0 ? "Over budget" : "On track" };
      } else if (dataKey === "sessions" && row.status === "Open") view = { ...row, expectedCash: sessionStats(row).expected };
      else if (dataKey === "landedCosts") view = { ...row, total: round2(Number(row.freight || 0) + Number(row.duties || 0) + Number(row.other || 0)) };
      return { row: view, index, key: index };
    });
  }
  var REPORT_SOURCE = {
    "sales-report": { page: "bill-history", dataKey: "bills" },
    "product-report": { page: "order-products", dataKey: "orderProducts" },
    "online-orders-report": { page: "online-orders", dataKey: "onlineOrders" },
    "purchasing-report": { page: "purchase-orders", dataKey: "purchaseOrders" },
    "loyalty-report": { page: "customers", dataKey: "customers" },
    "gift-card-report": { page: "gift-cards", dataKey: "giftCards" },
    "expenses-report": { page: "expenses", dataKey: "expenses" }
  };
  var PALETTE = ["red", "blue", "green", "amber", "violet", "orange"];
  var breakdown = (map, total) => [...map.entries()].sort((a, b) => b[1] - a[1]).map(([label, value], i) => ({ label, value, share: total ? Math.round(value / total * 100) : 0, color: PALETTE[i % PALETTE.length] }));
  var groupSum = (rows, labelFn, valFn) => {
    const m = /* @__PURE__ */ new Map();
    rows.forEach((r) => m.set(labelFn(r), (m.get(labelFn(r)) || 0) + Number(valFn(r) || 0)));
    return m;
  };
  function reportData(id) {
    const range = periodRange(state.period);
    const prev = prevRange(range);
    const d2 = state.data;
    const inP = (rows2, key, r = range) => rows2.filter((x) => inRange(x[key], r) && outletMatches(x));
    if (id === "sales-report") {
      const rows2 = billsIn(range);
      const sales = rows2.filter(isSale);
      const prevSales = billsIn(prev).filter(isSale);
      const net = sumTotal(sales);
      const lost = rows2.filter((b) => b.status === "Refunded" || b.status === "Voided");
      return {
        money: true,
        stats: [
          { label: "Net sales", value: net, kind: "money", sub: `${pctChange(net, sumTotal(prevSales))} vs previous period` },
          { label: "Transactions", value: sales.length, sub: `${pctChange(sales.length, prevSales.length)} vs previous period` },
          { label: "Average sale", value: sales.length ? round2(net / sales.length) : 0, kind: "money", sub: "Across completed and pending sales" },
          { label: "Refunds & voids", value: sumTotal(lost), kind: "money", sub: `${lost.length} bill${lost.length === 1 ? "" : "s"}` }
        ],
        series: { title: "Sales by period", tag: "Net sales", items: bucketSeries(sales, (b) => b.date, (b) => b.total, range), money: true },
        breakdown: { title: "Breakdown", sub: "By payment type", items: breakdown(groupSum(sales, (b) => b.method, (b) => b.total), net), format: "pct" }
      };
    }
    if (id === "product-report") {
      const rows2 = productPerformance(range);
      const rev = rows2.reduce((s, r) => s + r.revenue, 0);
      const qty = rows2.reduce((s, r) => s + r.quantity, 0);
      return {
        stats: [
          { label: "Product revenue", value: round2(rev), kind: "money", sub: "Store and online sales" },
          { label: "Units sold", value: qty, sub: "In the selected period" },
          { label: "Active products", value: rows2.length, sub: "With at least one sale" },
          { label: "Returns", value: rows2.reduce((s, r) => s + r.returns, 0), sub: "Units refunded" }
        ],
        series: { title: "Revenue by product", tag: "MVR", items: rows2.slice(0, 8).map((r) => ({ label: r.name.split(" ")[0], value: r.revenue })), money: true },
        breakdown: { title: "Breakdown", sub: "Share of revenue", items: breakdown(new Map(rows2.slice(0, 5).map((r) => [r.name, r.revenue])), rev), format: "pct" }
      };
    }
    if (id === "online-orders-report") {
      const rows2 = inP(d2.onlineOrders, "date");
      const live = rows2.filter((o) => o.status !== "Cancelled");
      const tot2 = sumTotal(live);
      return {
        stats: [
          { label: "Online revenue", value: tot2, kind: "money", sub: `${pctChange(tot2, sumTotal(inP(d2.onlineOrders, "date", prev).filter((o) => o.status !== "Cancelled")))} vs previous period` },
          { label: "Orders", value: rows2.length, sub: "All channels" },
          { label: "Average order", value: live.length ? round2(tot2 / live.length) : 0, kind: "money", sub: "Excluding cancelled" },
          { label: "Cancelled", value: rows2.length - live.length, sub: "Orders cancelled" }
        ],
        series: { title: "Orders by period", tag: "Revenue", items: bucketSeries(live, (o) => o.date, (o) => o.total, range), money: true },
        breakdown: { title: "Breakdown", sub: "By channel", items: breakdown(groupSum(live, (o) => o.channel, (o) => o.total), tot2), format: "pct" }
      };
    }
    if (id === "purchasing-report") {
      const rows2 = inP(d2.purchaseOrders, "createdAt");
      const tot2 = sumTotal(rows2);
      return {
        stats: [
          { label: "Purchase value", value: tot2, kind: "money", sub: `${rows2.length} purchase orders` },
          { label: "Open orders", value: rows2.filter((p) => !["Received", "Cancelled"].includes(p.status)).length, sub: "Awaiting delivery" },
          { label: "Units ordered", value: rows2.reduce((s, p) => s + Number(p.items || 0), 0), sub: "Across all orders" },
          { label: "Suppliers used", value: new Set(rows2.map((p) => p.supplier)).size, sub: "In this period" }
        ],
        series: { title: "Purchases by period", tag: "MVR", items: bucketSeries(rows2, (p) => p.createdAt, (p) => p.total, range), money: true },
        breakdown: { title: "Breakdown", sub: "By supplier", items: breakdown(groupSum(rows2, (p) => p.supplier, (p) => p.total), tot2), format: "pct" }
      };
    }
    if (id === "loyalty-report") {
      const cs = d2.customers;
      const pts = cs.reduce((s, c) => s + Number(c.loyalty || 0), 0);
      const tier = (c) => c.loyalty >= 350 ? "Gold" : c.loyalty >= 150 ? "Silver" : "Member";
      return {
        stats: [
          { label: "Members", value: cs.length, sub: "Registered customers" },
          { label: "Points outstanding", value: pts, sub: `${money0(pts / 100 * Number(state.settings.redemptionValue || 0))} redeemable` },
          { label: "Average visits", value: cs.length ? round2(cs.reduce((s, c) => s + Number(c.visits || 0), 0) / cs.length) : 0, sub: "Per customer" },
          { label: "Gold members", value: cs.filter((c) => tier(c) === "Gold").length, sub: "350+ points" }
        ],
        series: { title: "Points by customer", tag: "Points", items: [...cs].sort((a, b) => b.loyalty - a.loyalty).slice(0, 8).map((c) => ({ label: c.name.split(" ")[0], value: Number(c.loyalty) })) },
        breakdown: { title: "Breakdown", sub: "By tier", items: breakdown(groupSum(cs, tier, () => 1), cs.length), format: "count" }
      };
    }
    if (id === "gift-card-report") {
      const gs = d2.giftCards;
      const issued = sumBy(gs, (g) => g.value ?? g.balance);
      const bal = sumBy(gs.filter((g) => g.status === "Active"), (g) => g.balance);
      return {
        stats: [
          { label: "Cards issued", value: gs.length, sub: "All time" },
          { label: "Value issued", value: issued, kind: "money", sub: "Initial value" },
          { label: "Outstanding balance", value: bal, kind: "money", sub: "On active cards" },
          { label: "Redeemed", value: round2(issued - bal), kind: "money", sub: "Used or expired value" }
        ],
        series: { title: "Issued by period", tag: "MVR", items: bucketSeries(inP(gs, "issuedAt"), (g) => g.issuedAt, (g) => g.value ?? g.balance, range), money: true },
        breakdown: { title: "Breakdown", sub: "By status", items: breakdown(groupSum(gs, (g) => g.status, () => 1), gs.length), format: "count" }
      };
    }
    const rows = inP(d2.expenses, "date").filter((e) => e.status !== "Rejected");
    const tot = sumBy(rows, (e) => e.amount);
    const prevTot = sumBy(inP(d2.expenses, "date", prev).filter((e) => e.status !== "Rejected"), (e) => e.amount);
    return {
      stats: [
        { label: "Total spend", value: tot, kind: "money", sub: `${pctChange(tot, prevTot)} vs previous period` },
        { label: "Expense items", value: rows.length, sub: "Excluding rejected" },
        { label: "Largest expense", value: rows.length ? Math.max(...rows.map((e) => e.amount)) : 0, kind: "money", sub: "Single item" },
        { label: "Awaiting review", value: d2.expenses.filter((e) => e.status === "Review").length, sub: "Needs approval" }
      ],
      series: { title: "Spend by period", tag: "MVR", items: bucketSeries(rows, (e) => e.date, (e) => e.amount, range), money: true },
      breakdown: { title: "Breakdown", sub: "By category", items: breakdown(groupSum(rows, (e) => e.category, (e) => e.amount), tot), format: "pct" }
    };
  }
  var money0 = (v) => `MVR ${Math.round(v).toLocaleString("en-US")}`;
  function analytics() {
    const range = periodRange(state.period);
    const prev = prevRange(range);
    const sales = billsIn(range).filter(isSale);
    const prevSales = billsIn(prev).filter(isSale);
    const net = sumTotal(sales);
    const units = sales.reduce((s, b) => s + b.items, 0);
    const byCustomer = groupSum(sales.filter((b) => b.customer !== "Walk-in customer"), (b) => b.customer, () => 1);
    const repeat = byCustomer.size ? Math.round([...byCustomer.values()].filter((n) => n > 1).length / byCustomer.size * 1e3) / 10 : 0;
    const onHand = state.data.products.reduce((s, p) => s + Number(p.stockQty || 0), 0);
    const online = ordersIn(range).filter((o) => o.status !== "Cancelled");
    const onlineTotal = sumTotal(online);
    const channels = /* @__PURE__ */ new Map([["In store", net]]);
    online.forEach((o) => channels.set(o.channel, (channels.get(o.channel) || 0) + o.total));
    const all = net + onlineTotal;
    return {
      net,
      netChange: pctChange(net, sumTotal(prevSales)),
      average: sales.length ? round2(net / sales.length) : 0,
      basket: sales.length ? round2(units / sales.length) : 0,
      repeat,
      sellThrough: units + onHand ? Math.round(units / (units + onHand) * 1e3) / 10 : 0,
      momentum: salesSeries(range, "sales"),
      performers: productPerformance(range).slice(0, 4),
      channels: breakdown(channels, all)
    };
  }
  function notifications() {
    const d2 = state.data;
    const list = [];
    const out = d2.products.filter((p) => Number(p.stockQty) <= 0).length;
    const low = d2.products.filter((p) => Number(p.stockQty) > 0 && Number(p.stockQty) <= Number(state.settings.lowStockThreshold)).length;
    if (out) list.push({ id: "out", tone: "red", title: `${out} product${out > 1 ? "s" : ""} out of stock`, detail: "Reorder to avoid missed sales", view: "inventory" });
    if (low) list.push({ id: "low", tone: "amber", title: `${low} product${low > 1 ? "s" : ""} running low`, detail: `At or below ${state.settings.lowStockThreshold} units`, view: "inventory" });
    const rev = d2.onlinePayments.filter((p) => p.status === "Review").length;
    if (rev) list.push({ id: "pay", tone: "blue", title: `${rev} online payment${rev > 1 ? "s" : ""} to review`, detail: "Approve or reject the transfer", view: "online-payments" });
    const ship = d2.onlineOrders.filter((o) => o.status === "Ready to ship").length;
    if (ship) list.push({ id: "ship", tone: "green", title: `${ship} online order${ship > 1 ? "s" : ""} ready to ship`, detail: "Mark as completed once sent", view: "online-orders" });
    const soon = d2.quotations.filter((q) => q.status === "Open" && q.expires && q.expires - Date.now() < 3 * DAY).length;
    if (soon) list.push({ id: "quote", tone: "amber", title: `${soon} quotation${soon > 1 ? "s" : ""} expiring soon`, detail: "Follow up or convert to a sale", view: "quotations" });
    const exp = d2.expenses.filter((e) => e.status === "Review").length;
    if (exp) list.push({ id: "exp", tone: "amber", title: `${exp} expense${exp > 1 ? "s" : ""} awaiting approval`, detail: "Review in Expenses", view: "expenses" });
    const pend = d2.bills.filter((b) => b.status === "Pending").length;
    if (pend) list.push({ id: "credit", tone: "blue", title: `${pend} unpaid credit bill${pend > 1 ? "s" : ""}`, detail: "Mark paid when settled", view: "bill-history" });
    if (!d2.sessions.some((s) => s.status === "Open")) list.push({ id: "reg", tone: "red", title: "Register is closed", detail: "Open a session to start selling", view: "register" });
    (d2.activity || []).slice(0, 4).forEach((a, i) => list.push({ id: `act-${a.ts}-${i}`, tone: a.tone || "blue", title: a.text, detail: fmtDate(a.ts), view: a.view, activity: true }));
    return list;
  }
  var notificationSignature = () => notifications().map((n) => n.id).join("|");
  function globalSearch(query) {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const d2 = state.data;
    const hits = [];
    const test = (...vals) => vals.some((v) => String(v ?? "").toLowerCase().includes(q));
    d2.products.forEach((p, i) => {
      if (test(p.name, p.sku, p.category)) hits.push({ label: p.name, sub: `Product \xB7 ${p.sku}`, view: "products", key: "products", index: i });
    });
    d2.customers.forEach((c, i) => {
      if (test(c.name, c.mobile, c.email)) hits.push({ label: c.name, sub: `Customer \xB7 ${c.mobile || c.email || ""}`, view: "customers", key: "customers", index: i });
    });
    d2.bills.forEach((b, i) => {
      if (hits.length < 30 && test(b.id, b.customer)) hits.push({ label: b.id, sub: `Bill \xB7 ${b.customer}`, view: "bill-history", key: "bills", index: i });
    });
    d2.onlineOrders.forEach((o, i) => {
      if (test(o.id, o.customer)) hits.push({ label: o.id, sub: `Online order \xB7 ${o.customer}`, view: "online-orders", key: "onlineOrders", index: i });
    });
    d2.suppliers.forEach((s, i) => {
      if (test(s.name, s.contact)) hits.push({ label: s.name, sub: "Supplier", view: "suppliers", key: "suppliers", index: i });
    });
    d2.purchaseOrders.forEach((p, i) => {
      if (test(p.id, p.supplier)) hits.push({ label: p.id, sub: `Purchase order \xB7 ${p.supplier}`, view: "purchase-orders", key: "purchaseOrders", index: i });
    });
    d2.quotations.forEach((x, i) => {
      if (test(x.id, x.customer)) hits.push({ label: x.id, sub: `Quotation \xB7 ${x.customer}`, view: "quotations", key: "quotations", index: i });
    });
    return hits.slice(0, 9);
  }

  // ../pos/src/lib/actions.js
  var d = () => state.data;
  var thisMonth = (ts) => {
    const a = new Date(ts);
    const b = /* @__PURE__ */ new Date();
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  };
  var customerByName = (name) => d().customers.find((c) => c.name === name);
  var productBySku = (sku) => d().products.find((p) => p.sku === sku);
  function parseValues(key, raw, row) {
    const out = {};
    for (const field of getFields(key, row)) {
      let v = raw[field.name];
      if (v === void 0) continue;
      if (field.type === "number") v = v === "" ? 0 : num(v);
      else if (field.type === "date") v = fromInputDate(v);
      else v = String(v).trim();
      out[field.name] = v;
    }
    return out;
  }
  function validate(key, v, row) {
    for (const field of getFields(key, row)) {
      if (field.required && (v[field.name] === "" || v[field.name] == null || field.type === "date" && !v[field.name])) return `${field.label.replace(/ \(.*\)/, "")} is required.`;
      if (field.type === "number" && v[field.name] != null && v[field.name] < 0) return `${field.label.replace(/ \(.*\)/, "")} cannot be negative.`;
    }
    const nk = NAME_KEY[key];
    if (nk && v[nk]) {
      const clash = d()[key].some((r) => r !== row && String(r[nk]).toLowerCase() === String(v[nk]).toLowerCase());
      if (clash) return `${field0(key, nk)} "${v[nk]}" already exists.`;
    }
    return null;
  }
  var field0 = (key, name) => getFields(key).find((f2) => f2.name === name)?.label.replace(/ \(.*\)/, "") || "Value";
  function createRecord(key, raw) {
    const v = parseValues(key, raw);
    const err = validate(key, v);
    if (err) return err;
    const now = Date.now();
    const s = state.settings;
    const list = d()[key];
    let row;
    let label = "Record";
    switch (key) {
      case "customers":
        row = { ...v, visits: 0, outstanding: 0, creditLimit: v.creditLimit || 3e3, status: "Active", joinedAt: now };
        label = v.name;
        break;
      case "products":
        row = { ...v };
        syncProductStatus(row);
        label = v.name;
        break;
      case "categories":
        row = { ...v, products: 0, updatedAt: now, status: "Active" };
        label = v.name;
        break;
      case "giftCards":
        if (v.balance < num(s.minimumValue)) return `Minimum gift card value is ${money(s.minimumValue)}.`;
        row = { ...v, customer: v.customer || "Walk-in customer", issuedAt: now, value: v.balance, expires: v.expires || addMonths(now, num(s.defaultExpiry) || 12), status: "Active" };
        label = v.code;
        break;
      case "quotations":
        row = { id: makeId("QT-", list), ...v, createdAt: now, expires: v.expires || now + 7 * DAY, lines: [], status: "Open" };
        label = row.id;
        break;
      case "stockCounts":
        row = { id: makeId("CNT-", list), ...v, items: d().products.length, variance: null, status: "In progress" };
        label = row.id;
        break;
      case "transfers":
        if (v.from === v.to) return "Choose two different branches.";
        row = { id: makeId("TR-", list), ...v, createdAt: now, status: "Draft" };
        label = row.id;
        break;
      case "suppliers":
        row = { ...v, leadTime: num(v.leadTime) || 0, status: "Active" };
        label = v.name;
        break;
      case "purchaseOrders":
        row = { id: makeId(`${s.poPrefix || "PO"}-`, list), ...v, createdAt: now, expectedAt: v.expectedAt || now + num(s.defaultLeadTime || 4) * DAY, receivedUnits: 0, outlet: "Main branch", status: s.requireApproval ? "Pending approval" : "Awaiting delivery" };
        label = row.id;
        break;
      case "landedCosts": {
        const po = d().purchaseOrders.find((p) => p.id === v.purchaseOrder);
        row = { ...v, supplier: po?.supplier || "\u2014", date: v.date || now, total: round2(v.freight + v.duties + v.other) };
        label = v.purchaseOrder;
        break;
      }
      case "expenses": {
        if (s.requireReceipt && v.amount > num(s.approvalLimit) && !v.receipt) return `A receipt reference is required for expenses above ${money(s.approvalLimit)}.`;
        row = { ...v, date: v.date || now, status: v.amount > num(s.approvalLimit) ? "Review" : "Approved" };
        if (row.status === "Approved") applyExpense(row, 1);
        label = v.description;
        break;
      }
      case "expenseCategories":
        row = { ...v, monthToDate: 0 };
        label = v.name;
        break;
      default:
        return "This record type cannot be created.";
    }
    list.unshift(row);
    logActivity(`Added ${label}`, "green");
    save();
    return null;
  }
  function updateRecord(key, index, raw) {
    const row = d()[key][index];
    if (!row) return "Record not found.";
    const v = parseValues(key, raw, row);
    const err = validate(key, v, row);
    if (err) return err;
    const old = { ...row };
    if (key === "transfers" && v.from === v.to) return "Choose two different branches.";
    if (key === "expenses") {
      if (old.status === "Approved") applyExpense(old, -1);
    }
    Object.assign(row, v);
    if (key === "customers" && old.name !== row.name) {
      ["bills", "quotations", "giftCards", "onlineOrders", "onlinePayments"].forEach((k) => d()[k].forEach((x) => {
        if (x.customer === old.name) x.customer = row.name;
      }));
      if (state.cartCustomer === old.name) state.cartCustomer = row.name;
    }
    if (key === "products") {
      syncProductStatus(row);
      if (old.category !== row.category) touchCategory(row.category);
    }
    if (key === "categories" && old.name !== row.name) d().products.forEach((p) => {
      if (p.category === old.name) p.category = row.name;
    });
    if (key === "categories") row.updatedAt = Date.now();
    if (key === "suppliers") row.leadTime = num(row.leadTime);
    if (key === "suppliers" && old.name !== row.name) {
      d().purchaseOrders.forEach((p) => {
        if (p.supplier === old.name) p.supplier = row.name;
      });
      d().landedCosts.forEach((p) => {
        if (p.supplier === old.name) p.supplier = row.name;
      });
    }
    if (key === "expenseCategories" && old.name !== row.name) d().expenses.forEach((e) => {
      if (e.category === old.name) e.category = row.name;
    });
    if (key === "landedCosts") {
      row.total = round2(row.freight + row.duties + row.other);
      row.supplier = d().purchaseOrders.find((p) => p.id === row.purchaseOrder)?.supplier || row.supplier;
    }
    if (key === "expenses") {
      if (row.status === "Approved") applyExpense(row, 1);
    }
    if (key === "giftCards" && row.status === "Active" && row.balance <= 0) row.status = "Redeemed";
    logActivity(`Updated ${row.name || row.id || row.code || row.sku || "record"}`, "blue");
    save();
    return null;
  }
  function touchCategory(name) {
    const c = d().categories.find((x) => x.name === name);
    if (c) c.updatedAt = Date.now();
  }
  function applyExpense(exp, sign) {
    if (!thisMonth(exp.date)) return;
    const cat = d().expenseCategories.find((c) => c.name === exp.category);
    if (cat) cat.monthToDate = Math.max(0, round2(num(cat.monthToDate) + sign * num(exp.amount)));
  }
  function deleteRecord(key, index) {
    if (!EDITABLE.has(key)) return "This record cannot be deleted.";
    const row = d()[key][index];
    if (!row) return "Record not found.";
    if (key === "categories" && d().products.some((p) => p.category === row.name)) return "Move or delete the products in this category first.";
    if (key === "suppliers" && d().purchaseOrders.some((p) => p.supplier === row.name && !["Received", "Cancelled"].includes(p.status))) return "This supplier still has open purchase orders.";
    if (key === "expenseCategories" && d().expenses.some((e) => e.category === row.name)) return "This category still has expenses recorded against it.";
    if (key === "expenses" && row.status === "Approved") applyExpense(row, -1);
    d()[key].splice(index, 1);
    logActivity(`Deleted ${row.name || row.id || row.code || row.sku || "record"}`, "red");
    save();
    return null;
  }
  function rowActions(key, row) {
    const A = (id, label, icon, extra = {}) => ({ id, label, icon, ...extra });
    const list = [];
    switch (key) {
      case "bills":
        list.push(A("receipt", "View receipt", "receipt"));
        if (row.status === "Pending") list.push(A("mark-paid", "Mark as paid", "check"));
        if (row.status === "Completed") list.push(A("refund", "Refund bill", "undo", { danger: true, confirm: "Refund this bill? Stock and customer balances will be restored." }));
        if (row.status === "Completed" || row.status === "Pending") list.push(A("void", "Void bill", "ban", { danger: true, confirm: "Void this bill? Stock and customer balances will be restored." }));
        break;
      case "sessions":
        if (row.status === "Open") list.push(A("close-session", "Close session", "cash"));
        break;
      case "giftCards":
        if (row.status === "Active") {
          list.push(A("redeem", "Redeem value", "gift", { prompt: [{ name: "amount", label: "Amount to redeem (MVR)", type: "number", value: state.settings.allowPartialRedemption === false ? row.balance : "", min: 0, step: "any", required: true }], hint: state.settings.allowPartialRedemption === false ? "Partial redemption is off: the full balance is used." : `Balance ${money(row.balance)}` }));
          list.push(A("cancel-card", "Cancel card", "ban", { danger: true, confirm: "Cancel this gift card? The remaining balance becomes unusable." }));
        }
        break;
      case "quotations":
        if (row.status === "Open") {
          list.push(A("convert-quote", "Convert to sale", "cart"));
          list.push(A("cancel-quote", "Cancel quotation", "ban", { danger: true, confirm: "Cancel this quotation?" }));
        }
        break;
      case "onlinePayments":
        if (row.status === "Review") {
          list.push(A("approve-payment", "Approve payment", "check"));
          list.push(A("reject-payment", "Reject payment", "ban", { danger: true, confirm: "Reject this payment? The linked order will be cancelled." }));
        }
        break;
      case "customers":
        if (num(row.outstanding) > 0) list.push(A("collect", "Receive payment", "cash", { prompt: [{ name: "amount", label: "Amount received (MVR)", type: "number", value: row.outstanding, min: 0, step: "any", required: true }], hint: `Outstanding ${money(row.outstanding)}` }));
        list.push(A("adjust-points", "Adjust points", "star", { prompt: [{ name: "delta", label: "Points to add (use a minus to remove)", type: "number", value: "", step: 1, required: true }], hint: `Current balance ${row.loyalty || 0} points` }));
        break;
      case "products":
        list.push(A("adjust-stock", "Adjust stock", "inventory", { prompt: [{ name: "delta", label: "Quantity change (use a minus to remove)", type: "number", value: "", step: 1, required: true }, { name: "reason", label: "Reason", type: "select", options: ["Recount", "Damaged", "Returned to supplier", "Found stock", "Other"], value: "Recount" }], hint: `On hand ${row.stockQty}` }));
        if (num(row.stockQty) > 0) list.push(A("sell-product", "Add to sale", "cart"));
        break;
      case "categories":
        list.push(A("toggle-category", row.status === "Archived" ? "Reactivate" : "Archive", "folder"));
        break;
      case "stockCounts":
        if (row.status !== "Completed") list.push(A("count-sheet", "Open count sheet", "checklist"));
        break;
      case "transfers":
        if (row.status === "Draft" && state.settings.requireApproval) list.push(A("approve-transfer", "Approve transfer", "check"));
        if (row.status === "Draft" && !state.settings.requireApproval || row.status === "Approved") list.push(A("send-transfer", "Send stock", "transfer"));
        if (row.status === "In transit") list.push(A("receive-transfer", "Mark received", "check"));
        if (row.status === "Draft" || row.status === "Approved") list.push(A("cancel-transfer", "Cancel transfer", "ban", { danger: true, confirm: "Cancel this transfer?" }));
        break;
      case "suppliers":
        list.push(A("new-po", "New purchase order", "purchase"));
        list.push(A("toggle-supplier", row.status === "On hold" ? "Reactivate" : "Put on hold", "truck"));
        break;
      case "purchaseOrders":
        if (row.status === "Pending approval") list.push(A("approve-po", "Approve order", "check"));
        if (["Awaiting delivery", "Part received"].includes(row.status)) list.push(A("receive-po", "Receive stock", "checklist"));
        if (["Pending approval", "Awaiting delivery"].includes(row.status)) list.push(A("cancel-po", "Cancel order", "ban", { danger: true, confirm: "Cancel this purchase order?" }));
        break;
      case "onlineOrders": {
        const next = { "Payment review": "Accept payment & process", Processing: "Mark ready to ship", "Ready to ship": "Mark completed" }[row.status];
        if (next) list.push(A("advance-order", next, "check"));
        if (!["Completed", "Cancelled"].includes(row.status)) list.push(A("cancel-order", "Cancel order", "ban", { danger: true, confirm: "Cancel this order? Reserved stock is released." }));
        break;
      }
      case "expenses":
        if (row.status === "Review") {
          list.push(A("approve-expense", "Approve expense", "check"));
          list.push(A("reject-expense", "Reject expense", "ban", { danger: true, confirm: "Reject this expense?" }));
        }
        break;
      default:
        break;
    }
    return list;
  }
  function runRowAction(key, index, actionId, values = {}) {
    const row = d()[key][index];
    if (!row) return { error: "Record not found." };
    const ok = (message, extra = {}) => {
      save();
      return { message, ...extra };
    };
    switch (actionId) {
      case "receipt":
        return { next: { modal: { type: "receipt", billId: row.id } } };
      case "mark-paid":
        row.status = "Completed";
        if (row.method === "Credit") {
          const c = customerByName(row.customer);
          if (c) c.outstanding = Math.max(0, round2(num(c.outstanding) - row.total));
        }
        logActivity(`${row.id} marked as paid`, "green", "bill-history");
        return ok(`${row.id} marked as paid.`);
      case "refund":
      case "void": {
        const status = actionId === "void" ? "Voided" : "Refunded";
        reverseBill(row, status);
        logActivity(`${row.id} ${status.toLowerCase()}`, "red", "bill-history");
        return ok(`${row.id} ${status.toLowerCase()}. Stock restored.`);
      }
      case "close-session":
        return { next: { modal: { type: "close-register", sessionId: row.id } } };
      case "redeem": {
        const amount = round2(values.amount);
        if (amount <= 0) return { error: "Enter an amount above zero." };
        if (amount > row.balance) return { error: `The balance is only ${money(row.balance)}.` };
        if (state.settings.allowPartialRedemption === false && amount !== row.balance) return { error: "Partial redemption is turned off in settings." };
        row.balance = round2(row.balance - amount);
        if (row.balance <= 0) row.status = "Redeemed";
        logActivity(`${row.code} redeemed ${money(amount)}`, "blue", "gift-cards");
        return ok(`Redeemed ${money(amount)} from ${row.code}.`);
      }
      case "cancel-card":
        row.status = "Cancelled";
        return ok(`${row.code} cancelled.`);
      case "convert-quote":
        return convertQuote(row);
      case "cancel-quote":
        row.status = "Cancelled";
        return ok(`${row.id} cancelled.`);
      case "approve-payment":
      case "reject-payment": {
        const approve = actionId === "approve-payment";
        row.status = approve ? "Approved" : "Rejected";
        const order = d().onlineOrders.find((o) => o.id === row.order);
        if (order) {
          if (approve && order.status === "Payment review") order.status = "Processing";
          if (!approve && order.status !== "Cancelled") {
            releaseOrderStock(order);
            order.status = "Cancelled";
          }
        }
        logActivity(`${row.id} ${approve ? "approved" : "rejected"}`, approve ? "green" : "red", "online-payments");
        return ok(approve ? `${row.id} approved. Order moved to processing.` : `${row.id} rejected. Order cancelled.`);
      }
      case "collect": {
        const amount = round2(values.amount);
        if (amount <= 0) return { error: "Enter an amount above zero." };
        if (amount > num(row.outstanding)) return { error: `The outstanding balance is only ${money(row.outstanding)}.` };
        row.outstanding = round2(num(row.outstanding) - amount);
        let left = amount;
        d().bills.filter((b) => b.customer === row.name && b.status === "Pending" && b.method === "Credit").reverse().forEach((b) => {
          if (left >= b.total) {
            b.status = "Completed";
            left = round2(left - b.total);
          }
        });
        logActivity(`Received ${money(amount)} from ${row.name}`, "green", "customers");
        return ok(`Payment of ${money(amount)} recorded.`);
      }
      case "adjust-points": {
        const delta = Math.trunc(num(values.delta));
        if (!delta) return { error: "Enter a number of points." };
        row.loyalty = Math.max(0, num(row.loyalty) + delta);
        return ok(`${row.name} now has ${row.loyalty} points.`);
      }
      case "adjust-stock": {
        const delta = Math.trunc(num(values.delta));
        if (!delta) return { error: "Enter a quantity above or below zero." };
        const next = num(row.stockQty) + delta;
        if (next < 0 && !state.settings.allowNegativeStock) return { error: `Only ${row.stockQty} on hand; stock can't go below zero.` };
        row.stockQty = next;
        syncProductStatus(row);
        logActivity(`${row.name} stock ${delta > 0 ? "+" : ""}${delta} (${values.reason || "Adjustment"})`, "blue", "inventory");
        return ok(`${row.name}: ${row.stockQty} on hand.`);
      }
      case "sell-product":
        addToCart(row.sku);
        return { next: { view: "sell" }, message: null };
      case "toggle-category":
        row.status = row.status === "Archived" ? "Active" : "Archived";
        row.updatedAt = Date.now();
        return ok(`${row.name} ${row.status === "Archived" ? "archived" : "reactivated"}.`);
      case "count-sheet":
        return { next: { modal: { type: "count", index } } };
      case "approve-transfer":
        row.status = "Approved";
        return ok(`${row.id} approved.`);
      case "send-transfer":
        row.status = state.settings.autoReceive ? "Received" : "In transit";
        return ok(state.settings.autoReceive ? `${row.id} received at destination.` : `${row.id} is in transit.`);
      case "receive-transfer":
        row.status = "Received";
        return ok(`${row.id} received at ${row.to}.`);
      case "cancel-transfer":
        row.status = "Cancelled";
        return ok(`${row.id} cancelled.`);
      case "toggle-supplier":
        row.status = row.status === "On hold" ? "Active" : "On hold";
        return ok(`${row.name} ${row.status === "On hold" ? "put on hold" : "reactivated"}.`);
      case "new-po":
        return { next: { view: "purchase-orders", modal: { type: "create", key: "purchaseOrders", values: { supplier: row.name } } } };
      case "approve-po":
        row.status = "Awaiting delivery";
        return ok(`${row.id} approved.`);
      case "receive-po":
        return { next: { view: "receive-stock", receivePo: row.id } };
      case "cancel-po":
        row.status = "Cancelled";
        return ok(`${row.id} cancelled.`);
      case "advance-order": {
        const order = row;
        if (order.status === "Payment review") {
          const pay = d().onlinePayments.find((p) => p.order === order.id);
          if (pay) pay.status = "Approved";
          order.status = "Processing";
        } else if (order.status === "Processing") order.status = "Ready to ship";
        else if (order.status === "Ready to ship") order.status = "Completed";
        logActivity(`${order.id} is now ${order.status.toLowerCase()}`, "blue", "online-orders");
        return ok(`${order.id}: ${order.status}.`);
      }
      case "cancel-order": {
        releaseOrderStock(row);
        row.status = "Cancelled";
        const pay = d().onlinePayments.find((p) => p.order === row.id);
        if (pay && pay.status === "Review") pay.status = "Rejected";
        return ok(`${row.id} cancelled.`);
      }
      case "approve-expense":
        row.status = "Approved";
        applyExpense(row, 1);
        return ok("Expense approved.");
      case "reject-expense":
        row.status = "Rejected";
        return ok("Expense rejected.");
      default:
        return { error: "Unknown action." };
    }
  }
  function releaseOrderStock(order) {
    if (!state.settings.syncInventory || order.stockReleased || order.status === "Cancelled" || order.status === "Completed") return;
    if (!order.stockReserved) return;
    (order.lines || []).forEach((l) => {
      const p = productBySku(l.sku);
      if (p) {
        p.stockQty = num(p.stockQty) + l.qty;
        syncProductStatus(p);
      }
    });
    order.stockReleased = true;
  }
  function reverseBill(bill, status) {
    const wasPending = bill.status === "Pending";
    if (state.settings.trackStock !== false) (bill.lines || []).forEach((l) => {
      const p = productBySku(l.sku);
      if (p) {
        p.stockQty = num(p.stockQty) + l.qty;
        syncProductStatus(p);
      }
    });
    const c = customerByName(bill.customer);
    if (c) {
      c.visits = Math.max(0, num(c.visits) - 1);
      c.loyalty = Math.max(0, num(c.loyalty) - num(bill.pointsEarned) + num(bill.pointsUsed));
      if (bill.method === "Credit" && wasPending) c.outstanding = Math.max(0, round2(num(c.outstanding) - bill.total));
    }
    if (bill.giftCode) {
      const card = d().giftCards.find((g) => g.code === bill.giftCode);
      if (card) {
        card.balance = round2(card.balance + bill.total);
        if (card.status === "Redeemed") card.status = "Active";
      }
    }
    bill.status = status;
  }
  function addToCart(sku) {
    const p = productBySku(sku);
    if (!p) return "Product not found.";
    const line = state.cart.find((l) => l.sku === sku);
    const qty = (line?.quantity || 0) + 1;
    if (state.settings.trackStock !== false && !state.settings.allowNegativeStock && qty > num(p.stockQty)) {
      toast(num(p.stockQty) <= 0 ? `${p.name} is out of stock.` : `Only ${p.stockQty} ${p.name} in stock.`, "warn");
      return "stock";
    }
    if (line) line.quantity = qty;
    else state.cart.push({ sku: p.sku, name: p.name, price: p.price, category: p.category, quantity: 1 });
    save();
    return null;
  }
  function updateCart(sku, delta, name) {
    const line = state.cart.find((l) => sku ? l.sku === sku : l.name === name);
    if (!line) return;
    const p = sku ? productBySku(sku) : null;
    const next = line.quantity + delta;
    if (delta > 0 && p && state.settings.trackStock !== false && !state.settings.allowNegativeStock && next > num(p.stockQty)) {
      toast(`Only ${p.stockQty} ${p.name} in stock.`, "warn");
      return;
    }
    line.quantity = next;
    if (line.quantity <= 0) state.cart = state.cart.filter((l) => l !== line);
    save();
  }
  function clearCart() {
    state.cart = [];
    state.cartQuote = null;
    state.cartDiscount = "";
    state.redeemPoints = false;
    save();
  }
  function cartTotals() {
    const s = state.settings;
    const subtotal = round2(state.cart.reduce((sum, l) => sum + l.price * l.quantity, 0));
    const dv = Math.max(0, num(state.cartDiscount));
    let discount = state.cartDiscountType === "percent" ? subtotal * Math.min(dv, 100) / 100 : Math.min(dv, subtotal);
    discount = round2(discount);
    const customer = customerByName(state.cartCustomer);
    let pointsUsed = 0;
    let redeem = 0;
    if (state.redeemPoints && s.enabled !== false && customer && num(s.redemptionValue) > 0) {
      const blocks = Math.min(Math.floor(num(customer.loyalty) / 100), Math.ceil((subtotal - discount) / num(s.redemptionValue)));
      redeem = round2(Math.min(blocks * num(s.redemptionValue), subtotal - discount));
      pointsUsed = blocks > 0 ? blocks * 100 : 0;
    }
    const net = round2(subtotal - discount - redeem);
    const service = round2(net * num(s.serviceFee) / 100);
    const rate = num(s.taxRate);
    const tax = s.pricesIncludeTax ? round2(net * rate / (100 + rate)) : round2(net * rate / 100);
    const total = round2(s.pricesIncludeTax ? net + service : net + tax + service);
    const earned = s.enabled !== false && customer ? Math.floor(total / 100) * num(s.pointsPerUnit) : 0;
    return { subtotal, discount, redeem, pointsUsed, net, service, tax, total, earned, units: state.cart.reduce((n, l) => n + l.quantity, 0), customer };
  }
  function paymentMethods() {
    const s = state.settings;
    return [["Cash", s.cashEnabled], ["Card", s.cardEnabled], ["Transfer", s.transferEnabled], ["Credit", s.creditEnabled], ["Gift card", true]].filter(([, on]) => on !== false).map(([m]) => m);
  }
  function completeSale(values) {
    const session = openSession();
    if (!session) return "Open the register before completing a sale.";
    if (!state.cart.length) return "The cart is empty.";
    const t = cartTotals();
    const method = values.method;
    if (!paymentMethods().includes(method)) return `${method} payments are turned off in settings.`;
    const customerName = state.cartCustomer;
    const customer = t.customer;
    let tendered = null;
    let change = 0;
    let card = null;
    if (method === "Cash") {
      tendered = round2(values.tendered === "" || values.tendered == null ? t.total : values.tendered);
      if (tendered < t.total) return `Cash received is short by ${money(t.total - tendered)}.`;
      change = round2(tendered - t.total);
    }
    if (method === "Credit") {
      if (!customer) return "Choose a saved customer for a credit sale.";
      if (customer.status === "Blocked") return `${customer.name} is blocked from credit.`;
      const avail = num(customer.creditLimit || 3e3) - num(customer.outstanding);
      if (t.total > avail) return `Over the credit limit. Available credit: ${money(Math.max(0, avail))}.`;
    }
    if (method === "Gift card") {
      card = d().giftCards.find((g) => g.code === values.giftCode && g.status === "Active");
      if (!card) return "Choose an active gift card.";
      if (card.balance < t.total) return `Gift card balance is ${money(card.balance)}.`;
      if (card.expires && card.expires < Date.now()) return "This gift card has expired.";
    }
    if (state.settings.trackStock !== false && !state.settings.allowNegativeStock) {
      for (const l of state.cart) {
        const p = l.sku ? productBySku(l.sku) : null;
        if (p && num(p.stockQty) < l.quantity) return `${p.name}: only ${p.stockQty} in stock.`;
      }
    }
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    const bill = {
      id: `AF-${year}-${String(nextSeq(d().bills)).padStart(5, "0")}`,
      date: Date.now(),
      customer: customerName,
      items: t.units,
      method,
      subtotal: t.subtotal,
      discount: round2(t.discount + t.redeem),
      serviceFee: t.service,
      tax: t.tax,
      total: t.total,
      outlet: session.outlet,
      sessionId: session.id,
      status: method === "Credit" ? "Pending" : "Completed",
      lines: state.cart.map((l) => ({ sku: l.sku, name: l.name, price: l.price, qty: l.quantity })),
      note: values.note || "",
      tendered,
      change,
      giftCode: card?.code || null,
      pointsEarned: t.earned,
      pointsUsed: t.pointsUsed
    };
    d().bills.unshift(bill);
    if (state.settings.trackStock !== false) state.cart.forEach((l) => {
      const p = l.sku ? productBySku(l.sku) : null;
      if (p) {
        p.stockQty = num(p.stockQty) - l.quantity;
        syncProductStatus(p);
      }
    });
    if (customer) {
      customer.visits = num(customer.visits) + 1;
      customer.loyalty = Math.max(0, num(customer.loyalty) - t.pointsUsed + t.earned);
      if (method === "Credit") customer.outstanding = round2(num(customer.outstanding) + t.total);
    }
    if (card) {
      card.balance = round2(card.balance - t.total);
      if (card.balance <= 0) card.status = "Redeemed";
    }
    if (state.cartQuote) {
      const q = d().quotations.find((x) => x.id === state.cartQuote);
      if (q) q.status = "Converted";
    }
    logActivity(`Sale ${bill.id} \xB7 ${money(bill.total)} (${method})`, "green", "bill-history");
    state.cart = [];
    state.cartQuote = null;
    state.cartDiscount = "";
    state.redeemPoints = false;
    state.cartCustomer = "Walk-in customer";
    state.modal = { type: "receipt", billId: bill.id, fresh: true };
    save();
    return null;
  }
  function saveCartAsQuote() {
    if (!state.cart.length) return "The cart is empty.";
    const t = cartTotals();
    const q = { id: makeId("QT-", d().quotations), customer: state.cartCustomer, createdAt: Date.now(), items: t.units, total: t.total, expires: Date.now() + 7 * DAY, status: "Open", note: "", lines: state.cart.map((l) => ({ sku: l.sku, name: l.name, price: l.price, qty: l.quantity })) };
    d().quotations.unshift(q);
    logActivity(`Quotation ${q.id} saved`, "blue", "quotations");
    clearCart();
    save();
    return q.id;
  }
  function convertQuote(q) {
    state.cart = (q.lines && q.lines.length ? q.lines : [{ sku: null, name: `Quoted items (${q.items})`, price: q.total, qty: 1 }]).map((l) => {
      const p = l.sku ? productBySku(l.sku) : null;
      return { sku: l.sku, name: l.name, price: l.price, category: p?.category || "", quantity: l.qty };
    });
    state.cartCustomer = customerByName(q.customer) ? q.customer : "Walk-in customer";
    state.cartQuote = q.id;
    state.cartDiscount = "";
    save();
    return { message: `${q.id} loaded into the sale. Complete checkout to convert it.`, next: { view: "sell" } };
  }
  function openRegister(values) {
    if (openSession()) return "A register session is already open. Close it first.";
    const float = num(values.openingFloat);
    if (float < 0) return "Opening float cannot be negative.";
    const register = values.register || "Front counter";
    const s = { id: makeId("SES-", d().sessions), register, openedBy: String(values.openedBy || "").trim() || "Adflare Owner", openedAt: Date.now(), closedAt: null, openingFloat: float, cashIn: 0, cashOut: 0, expectedCash: null, counted: null, variance: null, status: "Open", outlet: register === "Branch 1 counter" ? "Branch 1" : "Main branch", activity: [{ ts: Date.now(), text: "Register opened", amount: float, tone: "green" }] };
    d().sessions.unshift(s);
    logActivity(`${register} opened (${s.id})`, "green", "register");
    save();
    return null;
  }
  function closeRegister(sessionId, values) {
    const s = d().sessions.find((x) => x.id === sessionId);
    if (!s || s.status !== "Open") return "That session is not open.";
    const counted = values.counted === "" || values.counted == null ? null : num(values.counted);
    if (counted == null || counted < 0) return "Enter the cash you counted in the drawer.";
    const expected = sessionStats(s).expected;
    s.expectedCash = expected;
    s.counted = counted;
    s.variance = round2(counted - expected);
    s.closedAt = Date.now();
    s.status = "Closed";
    s.activity.unshift({ ts: Date.now(), text: "Register closed", amount: counted, tone: "blue" });
    logActivity(`${s.register} closed \xB7 variance ${s.variance >= 0 ? "+" : ""}${s.variance}`, "blue", "sessions");
    save();
    return null;
  }
  function cashMove(values) {
    const s = openSession();
    if (!s) return "Open the register first.";
    const amount = round2(values.amount);
    if (amount <= 0) return "Enter an amount above zero.";
    const reason = String(values.reason || "").trim() || (values.kind === "out" ? "Cash out" : "Cash in");
    if (values.kind === "out") {
      if (amount > sessionStats(s).expected) return "There is not enough cash in the drawer.";
      s.cashOut = round2(num(s.cashOut) + amount);
      s.activity.unshift({ ts: Date.now(), text: `Cash out \xB7 ${reason}`, amount: -amount, tone: "red" });
    } else {
      s.cashIn = round2(num(s.cashIn) + amount);
      s.activity.unshift({ ts: Date.now(), text: `Cash in \xB7 ${reason}`, amount, tone: "blue" });
    }
    save();
    return null;
  }
  function receiveStock(values) {
    const po = d().purchaseOrders.find((p) => p.id === values.purchaseOrder);
    const product = productBySku(values.sku);
    const qty = Math.floor(num(values.quantity));
    if (!po || !["Awaiting delivery", "Part received"].includes(po.status)) return "Choose a purchase order that is awaiting delivery.";
    if (!product) return "Choose a product.";
    if (qty < 1) return "Quantity must be at least 1.";
    const remaining = num(po.items) - num(po.receivedUnits);
    if (qty > remaining) return `Only ${remaining} unit${remaining === 1 ? "" : "s"} still expected on ${po.id}.`;
    product.stockQty = num(product.stockQty) + qty;
    syncProductStatus(product);
    po.receivedUnits = num(po.receivedUnits) + qty;
    po.status = po.receivedUnits >= po.items ? "Received" : "Part received";
    d().receipts.unshift({ id: makeId("RCV-", d().receipts), purchaseOrder: po.id, product: product.name, quantity: qty, receivedAt: fromInputDate(values.receivedAt) || Date.now(), note: String(values.note || "").trim(), status: "Received" });
    logActivity(`Received ${qty} \xD7 ${product.name} on ${po.id}`, "green", "receive-stock");
    save();
    return null;
  }
  function applyStockCount(index, counts) {
    const sc = d().stockCounts[index];
    if (!sc) return "Count not found.";
    let diffs = 0;
    d().products.forEach((p) => {
      const raw = counts[p.sku];
      if (raw === "" || raw == null) return;
      const counted = Math.max(0, Math.floor(num(raw)));
      if (counted !== num(p.stockQty)) {
        diffs++;
        p.stockQty = counted;
        syncProductStatus(p);
      }
    });
    sc.items = d().products.length;
    sc.variance = diffs;
    sc.status = "Completed";
    logActivity(`${sc.id} completed \xB7 ${diffs} adjustment${diffs === 1 ? "" : "s"}`, "blue", "stock-counts");
    save();
    return null;
  }
  function simulateOnlineOrder() {
    const r = rng(Date.now() % 1e5);
    const stocked = d().products.filter((p) => num(p.stockQty) > 0);
    if (!stocked.length) return "No products in stock to order.";
    const lines = [];
    const used = /* @__PURE__ */ new Set();
    for (let i = 0; i < r.int(1, 3); i++) {
      const p = r.pick(stocked);
      if (used.has(p.sku)) continue;
      used.add(p.sku);
      lines.push({ sku: p.sku, name: p.name, price: p.price, qty: Math.min(r.int(1, 2), num(p.stockQty)) });
    }
    const total = round2(lines.reduce((s, l) => s + l.price * l.qty, 0));
    const customer = r.pick(d().customers).name;
    const method = r() < 0.5 ? "Card" : "Bank transfer";
    const auto = Boolean(state.settings.autoAccept);
    const order = { id: makeId("ON-", d().onlineOrders), channel: r.pick(["Web store", "Instagram", "Marketplace"]), customer, date: Date.now(), items: lines.reduce((s, l) => s + l.qty, 0), total, outlet: "Main branch", lines, status: method === "Card" || auto ? "Processing" : "Payment review" };
    d().onlinePayments.unshift({ id: makeId("PAY-", d().onlinePayments), order: order.id, customer, method, submittedAt: Date.now(), amount: total, status: method === "Card" || auto ? "Approved" : "Review" });
    if (state.settings.syncInventory !== false) {
      lines.forEach((l) => {
        const p = productBySku(l.sku);
        if (p) {
          p.stockQty = Math.max(0, num(p.stockQty) - l.qty);
          syncProductStatus(p);
        }
      });
      order.stockReserved = true;
    }
    d().onlineOrders.unshift(order);
    if (state.settings.orderNotifications !== false) logActivity(`New online order ${order.id} \xB7 ${money(total)}`, "blue", "online-orders");
    save();
    return order.id;
  }
  function saveSettings(fields, values) {
    const next = { ...state.settings };
    for (const [key, , type] of fields) {
      if (type === "checkbox") next[key] = Boolean(values[key]);
      else if (type === "number") {
        const n = Number(values[key]);
        if (values[key] === "" || !Number.isFinite(n) || n < 0) return "Enter a valid number (zero or more).";
        next[key] = n;
      } else next[key] = values[key];
    }
    if (!next.cashEnabled && !next.cardEnabled && !next.transferEnabled && !next.creditEnabled) return "Keep at least one payment method enabled.";
    state.settings = next;
    d().products.forEach(syncProductStatus);
    save();
    return null;
  }
  function download(name, mime, content) {
    const url = URL.createObjectURL(new Blob([content], { type: mime }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  function exportCsv(name, columns, rows, dataKey) {
    const head = columns.map(([, label]) => csvEscape(label)).join(",");
    const body = rows.map((row) => columns.map(([key]) => {
      let v = row[key];
      if (DATE_COLS.has(key) && typeof v === "number") v = fmtDate(v, !(key === "expires" || key === "expectedAt"));
      return csvEscape(v);
    }).join(",")).join("\n");
    download(`adflare-${name}.csv`, "text/csv;charset=utf-8", `${head}
${body}`);
  }
  function exportAllJson() {
    download("adflare-pos-data.json", "application/json", JSON.stringify({ exportedAt: (/* @__PURE__ */ new Date()).toISOString(), settings: state.settings, data: state.data }, null, 2));
  }

  // ../pos/src/lib/views.js
  var OUTLET_CHOICES = ['All branches', ...OUTLETS];
  function renderSidebar() {
    const d2 = state.data;
    const session = openSession();
    const reviewCount = d2.onlinePayments.filter((p) => p.status === "Review").length;
    const nav = navGroups.map((group) => `
    <div class="nav-group"><div class="nav-label">${esc(group.label)}</div>
      ${group.items.map((item) => `<button class="nav-item ${state.view === item.id ? "active" : ""}" type="button" data-view="${item.id}" aria-current="${state.view === item.id ? "page" : "false"}">${svgIcon(item.icon, 17)}<span>${esc(item.label)}</span>${item.id === "online-payments" && reviewCount ? `<i class="nav-count">${reviewCount}</i>` : ""}</button>`).join("")}
    </div>`).join("");
    const company = esc(state.settings.storeName || 'Adflare Market');
      const isAll = state.outlet === 'All branches';
      const mainTitle = isAll ? company : esc(state.outlet);
      const sub = isAll ? 'All branches' : company;
    return `
    <aside class="sidebar">
      <div class="sidebar-head"><div class="brand-lockup"><img src="/img/favicon.png" alt="" /><span>adflare<small>POINT OF SALE</small></span></div><button class="icon-btn sidebar-close" type="button" data-action="close-nav" aria-label="Close navigation">${svgIcon("close", 19)}</button></div>
      <div class="outlet-switch-wrap"><button class="outlet-switch" type="button" data-action="outlet-menu" aria-expanded="${Boolean(state.outletMenuOpen)}"><span class="outlet-mark">AF</span><span class="outlet-info"><b>${mainTitle}</b><small>${sub}</small></span>${svgIcon("chevron", 15)}</button>${state.outletMenuOpen ? `<div class="outlet-menu" role="menu" aria-label="Choose branch">${OUTLET_CHOICES.map((o) => `<button type="button" role="menuitemradio" aria-checked="${state.outlet === o}" data-outlet-choice="${esc(o)}">${o === 'All branches' ? `<span class=\"outlet-opt\"><b>${company}</b><small>All branches</small></span>` : esc(o)}${state.outlet === o ? svgIcon("check", 14) : ""}</button>`).join("")}</div>` : ""}</div>
      <nav class="side-nav" aria-label="Main navigation">${nav}</nav>
      <div class="sidebar-footer">
        <div class="register-status"><span class="status-dot ${session ? "green" : "gray"}"></span><span><b>${session ? "Register open" : "Register closed"}</b><small>${session ? `${esc(session.register)} \xB7 ${esc(session.id.replace("SES-00", "Session "))}` : "No active session"}</small></span><button type="button" class="mini-action" data-view="register" aria-label="Manage register">${svgIcon("chevron", 15)}</button></div>
        <div class="sidebar-profile"><div class="avatar">AF</div><span><b>Adflare Owner</b><small>${esc(state.settings.storeName || "Workspace")}</small></span><button class="mini-action" type="button" data-action="profile-menu" aria-label="Profile options">${svgIcon("dots", 18)}</button></div>
      </div>
    </aside>`;
  }
  function renderTopbar(meta) {
    const sig = notificationSignature();
    const unseen = sig && sig !== state.notifSeen;
    const hits = state.gq.trim().length >= 2 ? globalSearch(state.gq) : null;
    return `
    <header class="topbar">
      <div class="topbar-left"><button class="icon-btn menu-toggle" type="button" data-action="toggle-nav" aria-label="Open navigation">${svgIcon("menu", 20)}</button><div class="breadcrumbs"><span>Adflare POS</span>${svgIcon("chevron", 14)}<b>${esc(meta.title)}</b></div></div>
      <div class="topbar-actions">
        <div class="gs-wrap"><label class="global-search">${svgIcon("search", 17)}<input type="search" data-global-search placeholder="Search everything" value="${esc(state.gq)}" aria-label="Search products, customers, bills and orders" autocomplete="off" /><kbd>\u2318 K</kbd></label>${hits ? `<div class="gs-results" role="listbox">${hits.length ? hits.map((h) => `<button type="button" role="option" data-action="gs-open" data-view="${h.view}" data-key="${h.key}" data-index="${h.index}"><b>${esc(h.label)}</b><small>${esc(h.sub)}</small></button>`).join("") : '<div class="gs-empty">No matches found.</div>'}</div>` : ""}</div>
        <span class="topbar-divider"></span>
        <div class="pop-anchor"><button class="icon-btn notification-btn" type="button" data-action="notifications" aria-label="Notifications" aria-expanded="${state.popover === "notif"}">${svgIcon("bell", 18)}${unseen ? "<i></i>" : ""}</button>${state.popover === "notif" ? renderNotifPop() : ""}</div>
        <div class="pop-anchor"><button class="top-avatar" type="button" data-action="profile-menu" aria-label="Open profile menu" aria-expanded="${state.popover === "profile"}">AF</button>${state.popover === "profile" ? renderProfilePop() : ""}</div>
        <button class="icon-btn" type="button" data-action="logout" aria-label="Sign out" title="Sign out">${svgIcon("logout", 16)}</button>
      </div>
    </header>`;
  }
  function renderNotifPop() {
    const list = notifications();
    return `<div class="pop pop-notif" role="dialog" aria-label="Notifications"><div class="pop-head"><b>Notifications</b><button type="button" class="text-action" data-action="mark-seen">Mark all read</button></div><div class="pop-list">${list.length ? list.map((n) => `<button type="button" class="pop-item" ${n.view ? `data-view="${n.view}"` : 'data-action="close-pop"'}><i class="activity-dot ${esc(n.tone)}"></i><span><b>${esc(n.title)}</b><small>${esc(n.detail)}</small></span></button>`).join("") : '<div class="pop-empty">You&rsquo;re all caught up.</div>'}</div></div>`;
  }
  function renderProfilePop() {
    return `<div class="pop pop-profile" role="menu"><div class="pop-user"><span class="avatar">AF</span><span><b>Adflare Owner</b><small>${esc(state.user || state.settings.email)}</small></span></div>
    <button type="button" role="menuitem" data-view="admin">${svgIcon("settings", 16)} Store settings</button>
    <button type="button" role="menuitem" data-action="export-all">${svgIcon("download", 16)} Export all data (JSON)</button>
    <button type="button" role="menuitem" data-action="reset-data">${svgIcon("refresh", 16)} Reset data</button>
    <button type="button" role="menuitem" data-action="logout">${svgIcon("logout", 16)} Sign out</button></div>`;
  }
  function renderNotice() {
    return "";
  }
  function pageHeading(meta, action = "") {
    return `<div class="page-heading"><div><div class="eyebrow">${esc(state.view === "home" ? "OVERVIEW" : "ADFLARE POS")}</div><h1>${esc(meta.title)}</h1><p>${esc(meta.subtitle)}</p></div><div class="heading-actions">${action}</div></div>`;
  }
  var periodSelect = (options = PERIODS) => `<label class="select-wrap">${svgIcon("calendar", 16)}<select data-home-filter="period" aria-label="Reporting period">${options.map((p) => `<option ${state.period === p ? "selected" : ""}>${p}</option>`).join("")}</select></label>`;
  var outletSelect = () => `<label class="select-wrap">${svgIcon("filter", 16)}<select data-home-filter="outlet" aria-label="Branch">${OUTLET_CHOICES.map((o) => `<option ${state.outlet === o ? "selected" : ""}>${o}</option>`).join("")}</select></label>`;
  function niceMax(v) {
    if (v <= 0) return 3;
    const unit = 10 ** Math.floor(Math.log10(v / 3));
    return Math.ceil(v / (3 * unit)) * 3 * unit;
  }
  var thin = (items, max = 8) => {
    const step = Math.ceil(items.length / max);
    return items.map((x, i) => i % step === 0 ? x : "");
  };
  function lineChart(series, isMoney) {
    const n = series.length;
    const max = niceMax(Math.max(0, ...series.map((p) => p.value)));
    const fmt = (v) => isMoney ? moneyShort(v) : String(Math.round(v));
    const x = (i) => n === 1 ? 192 : 20 + i * (344 / (n - 1));
    const y = (v) => 158 - v / max * 112;
    const pts = series.map((p, i) => `${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
    const labels = thin(series.map((p) => p.label));
    const ticks = [max, max * 2 / 3, max / 3, 0];
    return `<div class="chart-area"><div class="chart-y">${ticks.map((t) => `<span>${t ? fmt(t) : "0"}</span>`).join("")}</div><div class="chart-plot"><div class="chart-grid-lines"><i></i><i></i><i></i><i></i></div>
    <svg viewBox="0 0 384 168" preserveAspectRatio="none" role="img" aria-label="Trend chart"><defs><linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#ed2939" stop-opacity=".18"/><stop offset="100%" stop-color="#ed2939" stop-opacity="0"/></linearGradient></defs>
    <polygon points="${pts} ${x(n - 1).toFixed(1)},168 ${x(0).toFixed(1)},168" fill="url(#salesFill)"/><polyline points="${pts}" fill="none" stroke="#ed2939" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
    ${n <= 14 ? series.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="4" fill="#fff" stroke="#ed2939" stroke-width="2" vector-effect="non-scaling-stroke"><title>${esc(p.label)}: ${isMoney ? money(p.value) : p.value}</title></circle>`).join("") : ""}</svg>
    <div class="chart-x" style="display:grid;grid-template-columns:repeat(${n},minmax(0,1fr))">${labels.map((l) => `<span style="text-align:center;overflow:visible;white-space:nowrap">${esc(l)}</span>`).join("")}</div></div></div>`;
  }
  function barChart(series) {
    const max = Math.max(1, ...series.map((p) => p.value));
    const labels = thin(series.map((p) => p.label), 10);
    return `<div class="bar-chart">${series.map((p, i) => `<div class="bar-col" title="${esc(p.label)}: ${p.value}"><div class="bar-wrap"><i style="height:${Math.max(p.value ? 4 : 0, Math.round(p.value / max * 100))}%"></i></div><span>${esc(labels[i])}</span></div>`).join("")}</div>`;
  }
  function renderHome(meta) {
    const m = homeMetrics();
    const range = m.range;
    const sel = state.chartMetric;
    const isMoney = sel !== "count";
    const main = salesSeries(range, sel);
    const counts = salesSeries(range, "count");
    const total = counts.reduce((s, p) => s + p.value, 0);
    const days = Math.max(1, Math.round((Math.min(range.end, Date.now() + 864e5) - range.start) / 864e5));
    const pos = (c) => String(c).startsWith("+") ? "positive" : "neutral";
    const cards = [
      ["Net sales", money(m.net), m.netChange, "coins", "red", "vs. previous period", "bill-history"],
      ["Sales count", String(m.count), m.countChange, "receipt", "blue", "vs. previous period", "bill-history"],
      ["Month to date", money(m.mtd), m.mtdChange, "chart", "violet", "vs. last month", "sales-report"],
      ["Outstanding", money(m.outstanding), `${m.owingCount} accounts`, "wallet", "amber", "customer balances", "customers"],
      ["Customers", m.customers.toLocaleString(), `+${m.joined}`, "users", "green", "joined this month", "customers"],
      ["Products sold", m.units.toLocaleString(), m.unitsChange, "box", "slate", "vs. previous period", "order-products"],
      ["Refunds", money(m.refundAmount), `${m.refundCount} bills`, "refresh", "orange", state.period.toLowerCase(), "bill-history", "Refunded"],
      ["Voids", String(m.voidCount), money(m.voidAmount), "close", "rose", state.period.toLowerCase(), "bill-history", "Voided"]
    ];
    const recent = state.data.bills.filter(outletMatches).slice(0, 4);
    const low = state.data.products.filter((p) => num(p.stockQty) <= num(state.settings.lowStockThreshold)).slice(0, 4);
    const ml = { sales: "Net sales", count: "Transactions", average: "Average sale" };
    const chartTitle = { sales: "Net sales", count: "Transactions", average: "Average sale" }[sel];
    return `${pageHeading(meta, `${outletSelect()}${periodSelect()}`)}
    <section class="brand-banner"><div class="banner-content"><span class="banner-tag">ADFLARE \xB7 SMARTER OPERATIONS</span><h2>Make every shift count.</h2><p>One clear view for your sales, inventory and customers.</p><button class="banner-button" type="button" data-view="analytics">Explore analytics ${svgIcon("arrow", 15)}</button></div><div class="banner-art" aria-hidden="true"><div class="banner-ring ring-one"></div><div class="banner-ring ring-two"></div><div class="banner-card"><span class="spark">\u2726</span><b>AF</b><small>ADFLARE</small></div><div class="banner-line line-one"></div><div class="banner-line line-two"></div></div></section>
    <section class="metric-grid" aria-label="Sales metrics">${cards.map(([label, value, change, icon, tone, note, view, status]) => `<article class="metric-card"><div class="metric-top"><span class="metric-icon tone-${tone}">${svgIcon(icon, 17)}</span><button class="metric-more" type="button" data-view="${view}" ${status ? `data-status="${status}"` : ""} aria-label="Open ${esc(label)} details">${svgIcon("arrow", 16)}</button></div><span class="metric-label">${esc(label)}</span><strong>${esc(value)}</strong><div class="metric-foot"><span class="metric-change ${tone === "amber" || tone === "rose" || tone === "orange" ? "neutral" : pos(change)}">${esc(change)}</span><span>${esc(note)}</span></div></article>`).join("")}</section>
    <section class="content-grid home-grid">
      <article class="card sales-chart-card"><div class="card-head"><div><h2>${chartTitle}</h2><p>${esc(state.period)} \xB7 ${esc(state.outlet)}</p></div><label class="select-plain"><select data-chart-metric aria-label="Chart metric" style="border:0;background:transparent;font:inherit;color:inherit;cursor:pointer">${Object.entries(ml).map(([k, v]) => `<option value="${k}" ${sel === k ? "selected" : ""}>${v}</option>`).join("")}</select></label></div><div class="chart-legend"><span><i class="legend-dot red"></i> ${chartTitle}</span></div>${lineChart(main, isMoney)}</article>
      <article class="card sales-count-card"><div class="card-head"><div><h2>Sales count</h2><p>Transactions \xB7 ${esc(state.period)}</p></div><span class="count-total">${total.toLocaleString()} <small>total</small></span></div>${barChart(counts)}<div class="count-summary"><span>Average per day</span><b>${total ? Math.max(1, Math.round(total / days)) : 0} bills</b></div></article>
      <article class="card recent-card"><div class="card-head"><div><h2>Recent bills</h2><p>Latest transactions</p></div><button type="button" class="text-action" data-view="bill-history">View all ${svgIcon("arrow", 15)}</button></div><div class="mini-table">${recent.map((b) => `<button type="button" class="mini-row mini-click" data-action="detail" data-key="bills" data-index="${state.data.bills.indexOf(b)}"><span class="mini-avatar">${esc(b.customer.split(" ").map((x) => x[0]).slice(0, 2).join(""))}</span><span class="mini-person"><b>${esc(b.customer)}</b><small>${esc(b.id)} \xB7 ${esc(fmtDate(b.date))}</small></span><span class="mini-amount">${money(b.total)}</span><span class="status-pill ${statusClass(b.status)}">${esc(b.status)}</span></button>`).join("") || '<div class="empty-state">No bills yet.</div>'}</div></article>
      <article class="card low-stock-card"><div class="card-head"><div><h2>Stock to review</h2><p>Items running low or out</p></div><button type="button" class="text-action" data-view="inventory">Inventory ${svgIcon("arrow", 15)}</button></div><div class="stock-alert-list">${low.map((p) => `<button type="button" class="stock-alert-row mini-click" data-action="detail" data-key="products" data-index="${state.data.products.indexOf(p)}"><span class="product-thumb">${svgIcon("box", 18)}</span><span class="stock-product"><b>${esc(p.name)}</b><small>${esc(p.sku)} \xB7 ${esc(p.category)}</small></span><span class="stock-qty ${num(p.stockQty) === 0 ? "out" : ""}">${num(p.stockQty) === 0 ? "Out" : `${esc(p.stockQty)} left`}</span></button>`).join("") || '<div class="empty-state">Stock levels look healthy.</div>'}</div></article>
    </section>`;
  }
  function renderSell(meta) {
    const s = state.settings;
    const session = openSession();
    const q = state.productQuery.toLowerCase();
    const track = s.trackStock !== false && !s.allowNegativeStock;
    const products = state.data.products.filter((p) => p.status !== "Archived" && `${p.name} ${p.category} ${p.sku}`.toLowerCase().includes(q) && (state.productCategory === "all" || p.category === state.productCategory) && (!state.inStockOnly || num(p.stockQty) > 0));
    const cats = state.data.categories.filter((c) => c.status !== "Archived").map((c) => c.name);
    return `${pageHeading(meta, `<button type="button" class="btn btn-secondary" data-view="bill-history">${svgIcon("receipt", 16)} Bill history</button>`)}
    <div class="pos-layout">
      <section class="card catalog-panel"><div class="catalog-toolbar"><label class="catalog-search">${svgIcon("search", 17)}<input type="search" data-product-search placeholder="Scan barcode or search products" value="${esc(state.productQuery)}" /></label><button type="button" class="icon-btn filter-button ${state.inStockOnly ? "active" : ""}" data-action="product-filter" aria-pressed="${state.inStockOnly}" aria-label="Show in-stock products only" title="In-stock only">${svgIcon("filter", 17)}</button></div>
      <div class="category-chips"><button class="chip ${state.productCategory === "all" ? "active" : ""}" type="button" data-category="all">All items</button>${cats.map((c) => `<button class="chip ${state.productCategory === c ? "active" : ""}" type="button" data-category="${esc(c)}">${esc(c)}</button>`).join("")}</div>
      <div class="product-grid">${renderProductTiles(products, track)}</div></section>
      ${renderCartPanel(session)}
    </div>`;
  }
  function renderProductTiles(products, track) {
    return products.map((p) => {
      const out = track && num(p.stockQty) <= 0;
      return `<article class="product-tile ${out ? "is-out" : ""}"><div class="product-tile-art">${svgIcon("box", 25)}<span class="product-category">${esc(p.category)}</span></div><div class="product-tile-info"><b>${esc(p.name)}</b><small>${esc(p.sku)} \xB7 ${out ? "Out of stock" : `${esc(p.stockQty)} in stock`}</small><div><strong>${money(p.price)}</strong><button type="button" class="add-product" data-action="add-cart" data-id="${esc(p.sku)}" aria-label="Add ${esc(p.name)}" ${out ? "disabled" : ""}>${svgIcon("plus", 17)}</button></div></div></article>`;
    }).join("") || '<div class="empty-state">No matching products.</div>';
  }
  function renderCartPanel(session = openSession()) {
    const t = cartTotals();
    const s = state.settings;
    const cust = t.customer;
    const canRedeem = s.enabled !== false && cust && num(cust.loyalty) >= 100 && num(s.redemptionValue) > 0;
    return `<aside class="card cart-panel"><div class="cart-head"><div><h2>Current sale</h2><p>${t.units} ${t.units === 1 ? "item" : "items"} in cart${state.cartQuote ? ` \xB7 from ${esc(state.cartQuote)}` : ""}</p></div><button class="icon-btn" type="button" data-action="clear-cart" aria-label="Clear cart" title="Clear cart">${svgIcon("trash", 17)}</button></div>
    <div class="cart-register"><span class="status-dot ${session ? "green" : "gray"}"></span><span><b>${session ? esc(session.register) : "Register closed"}</b><small>${session ? `Session ${esc(session.id)}` : "Open a register to begin"}</small></span><button type="button" class="text-action" ${session ? 'data-view="register"' : 'data-action="open-register-modal"'}>${session ? "Manage" : "Open"}</button></div>
    <label class="customer-select"><span>Customer</span><select id="cart-customer" data-cart-customer><option ${state.cartCustomer === "Walk-in customer" ? "selected" : ""}>Walk-in customer</option>${state.data.customers.filter((c) => c.status !== "Blocked").map((c) => `<option ${state.cartCustomer === c.name ? "selected" : ""}>${esc(c.name)}</option>`).join("")}</select></label>
    <div class="cart-lines">${state.cart.length ? state.cart.map((l) => `<div class="cart-line"><span class="cart-line-thumb">${svgIcon("box", 16)}</span><span class="cart-line-name"><b>${esc(l.name)}</b><small>${money(l.price)} each</small></span><span class="qty-stepper"><button type="button" data-action="qty-down" data-id="${esc(l.sku ?? "")}" data-name="${esc(l.name)}" aria-label="Decrease quantity">\u2212</button><b>${l.quantity}</b><button type="button" data-action="qty-up" data-id="${esc(l.sku ?? "")}" data-name="${esc(l.name)}" aria-label="Increase quantity">+</button></span><strong>${money(l.price * l.quantity)}</strong></div>`).join("") : `<div class="cart-empty"><span class="cart-empty-icon">${svgIcon("cart", 22)}</span><b>Your cart is empty</b><small>Tap + on a product to start a sale.</small></div>`}</div>
    <div class="cart-discount"><label><span>Discount</span><input type="number" min="0" step="any" data-cart-discount placeholder="0" value="${esc(state.cartDiscount)}" /></label><select data-cart-discount-type aria-label="Discount type"><option value="amount" ${state.cartDiscountType === "amount" ? "selected" : ""}>MVR</option><option value="percent" ${state.cartDiscountType === "percent" ? "selected" : ""}>%</option></select></div>
    ${canRedeem ? `<label class="cart-redeem"><input type="checkbox" data-cart-redeem ${state.redeemPoints ? "checked" : ""} /><span>Redeem points <small>(${cust.loyalty} available)</small></span></label>` : ""}
    <div class="cart-summary"><div><span>Subtotal</span><b>${money(t.subtotal)}</b></div>${t.discount ? `<div><span>Discount</span><b>\u2212${money(t.discount)}</b></div>` : ""}${t.redeem ? `<div><span>Points redeemed (${t.pointsUsed})</span><b>\u2212${money(t.redeem)}</b></div>` : ""}${t.service ? `<div><span>Service fee (${s.serviceFee}%)</span><b>${money(t.service)}</b></div>` : ""}<div><span>${s.pricesIncludeTax ? "Tax included" : "Tax"} (${s.taxRate}%)</span><b>${money(t.tax)}</b></div><div class="cart-total"><span>Total</span><strong>${money(t.total)}</strong></div></div>
    <button class="btn btn-primary btn-wide checkout-button" type="button" data-action="checkout" ${!state.cart.length ? "disabled" : ""}>${svgIcon("card", 17)} Checkout <span>${money(t.total)}</span></button>
    <button class="btn btn-secondary btn-wide" type="button" data-action="save-quote" ${!state.cart.length ? "disabled" : ""}>${svgIcon("quote", 16)} Save as quotation</button>
    <p class="cart-footnote">${t.earned ? `Earns ${t.earned} loyalty points \xB7 ` : ""}Payments are recorded manually</p></aside>`;
  }
  function renderRegister(meta) {
    const open = openSession();
    const last = state.data.sessions.find((s2) => s2.status === "Closed");
    const s = open || last;
    const st = s ? sessionStats(s) : null;
    const acts = [];
    if (s) {
      (s.activity || []).forEach((a) => acts.push({ ts: a.ts, title: a.text, sub: fmtTime(a.ts), amount: a.amount != null ? money(a.amount) : "\u2014", tone: a.tone || "blue" }));
      state.data.bills.filter((b) => b.sessionId === s.id).slice(0, 5).forEach((b) => acts.push({ ts: b.date, title: `Sale ${b.status === "Completed" || b.status === "Pending" ? "completed" : b.status.toLowerCase()}`, sub: `${b.id} \xB7 ${fmtTime(b.date)}`, amount: money(b.total), tone: "red" }));
      acts.sort((a, b) => b.ts - a.ts);
    }
    const buttons = open ? `<button class="btn btn-secondary" type="button" data-action="cash-move-modal">${svgIcon("cash", 16)} Cash in / out</button><button class="btn btn-primary" type="button" data-action="close-register-modal">Close register</button>` : `<button class="btn btn-primary" type="button" data-action="open-register-modal">Open register</button>`;
    return `${pageHeading(meta, buttons)}
    <section class="register-summary-grid"><article class="card register-main-card"><div class="register-hero"><span class="register-icon">${svgIcon("cash", 22)}</span><span class="status-pill ${open ? "status-open" : "status-closed"}"><i></i>${open ? "Open" : "Closed"}</span></div><h2>${esc(s?.register || "Front counter")}</h2><p>${esc(s?.outlet || "Main branch")} \xB7 ${open ? "Active session" : "Last session summary"}</p>
      <div class="register-meta"><div><span>${open ? "Current session" : "Last session"}</span><b>${esc(s?.id || "None yet")}</b></div><div><span>Opened by</span><b>${esc(s?.openedBy || "\u2014")}</b></div><div><span>Opening float</span><b>${s ? money(s.openingFloat) : "\u2014"}</b></div><div><span>${open ? "Started" : "Closed"}</span><b>${s ? esc(fmtDate(open ? s.openedAt : s.closedAt)) : "\u2014"}</b></div></div>
      <div class="register-note">${svgIcon("info", 16)} ${open ? "Sales made on the Sell page are added to this session automatically." : "The register is closed. Open a session to start selling."}</div></article>
      <article class="card register-stats"><h3>${open ? "Shift snapshot" : "Last shift"}</h3>${st ? `<div class="shift-stat"><span>Sales this shift (${st.count})</span><b>${money(st.sales)}</b></div><div class="shift-stat"><span>Cash payments</span><b>${money(st.cash)}</b></div><div class="shift-stat"><span>Card payments</span><b>${money(st.card)}</b></div><div class="shift-stat"><span>Other payments</span><b>${money(st.other)}</b></div>${num(s.cashIn) || num(s.cashOut) ? `<div class="shift-stat"><span>Cash in / out</span><b>${money(s.cashIn)} / ${money(s.cashOut)}</b></div>` : ""}<div class="shift-stat total"><span>${open ? "Expected in drawer" : "Counted in drawer"}</span><b>${money(open ? st.expected : s.counted)}</b></div>${!open && s.variance != null ? `<div class="shift-stat"><span>Variance</span><b>${signed(s.variance)}</b></div>` : ""}` : '<div class="empty-state">No sessions yet.</div>'}<button type="button" class="text-action" data-view="sessions">View session history ${svgIcon("arrow", 15)}</button></article></section>
    <section class="card register-lower"><div class="card-head"><div><h2>Register activity</h2><p>Recent actions in ${open ? "the open" : "the last"} session</p></div><button class="text-action" type="button" data-view="sessions">All sessions ${svgIcon("arrow", 15)}</button></div><div class="activity-list">${acts.slice(0, 6).map((a) => `<div><i class="activity-dot ${esc(a.tone)}"></i><span><b>${esc(a.title)}</b><small>${esc(a.sub)}</small></span><strong>${esc(a.amount)}</strong></div>`).join("") || '<div class="empty-state">No activity yet.</div>'}</div></section>`;
  }
  function renderInventory(meta) {
    const d2 = state.data;
    const th = num(state.settings.lowStockThreshold);
    const low = d2.products.filter((p) => num(p.stockQty) <= th);
    const value = d2.products.reduce((sum, p) => sum + num(p.price) * num(p.stockQty), 0);
    const pending = d2.transfers.filter((t) => ["Draft", "Approved", "In transit"].includes(t.status)).length;
    return `${pageHeading(meta, `<button class="btn btn-secondary" type="button" data-action="export-products">${svgIcon("download", 16)} Export</button><button class="btn btn-primary" type="button" data-action="new-stock-count">${svgIcon("checklist", 16)} Start stock count</button>`)}
    <section class="inventory-kpis"><article class="card inventory-kpi"><span>Units on hand</span><strong>${d2.products.reduce((s, p) => s + num(p.stockQty), 0).toLocaleString()}</strong><small>Across ${d2.products.length} products</small></article><article class="card inventory-kpi"><span>Stock value</span><strong>${money(value)}</strong><small>Retail value, not cost</small></article><article class="card inventory-kpi"><span>Low stock</span><strong class="red-text">${low.length}</strong><small>At or below ${th} units</small></article><article class="card inventory-kpi"><span>Pending transfers</span><strong>${pending}</strong><small>Draft, approved or in transit</small></article></section>
    <section class="content-grid inventory-grid"><article class="card"><div class="card-head"><div><h2>Stock health</h2><p>Inventory by product</p></div><button class="text-action" type="button" data-view="products">View products ${svgIcon("arrow", 15)}</button></div><div class="stock-table">${d2.products.slice(0, 8).map((p) => `<button type="button" class="stock-table-row mini-click" data-action="detail" data-key="products" data-index="${d2.products.indexOf(p)}"><span class="product-thumb">${svgIcon("box", 17)}</span><span class="stock-product"><b>${esc(p.name)}</b><small>${esc(p.sku)} \xB7 ${esc(p.category)}</small></span><span class="stock-meter"><i style="width:${Math.min(100, num(p.stockQty) * 2)}%"></i></span><span class="stock-qty ${num(p.stockQty) <= th ? "out" : ""}">${num(p.stockQty)} units</span><span class="status-pill ${statusClass(p.status)}">${esc(p.status)}</span></button>`).join("")}</div></article>
      <article class="card low-stock-side"><div class="card-head"><div><h2>Needs attention</h2><p>Reorder suggestions</p></div><span class="attention-count">${low.length}</span></div>${low.map((p) => `<div class="attention-row"><span class="attention-icon">${svgIcon("inventory", 17)}</span><span><b>${esc(p.name)}</b><small>${num(p.stockQty) === 0 ? "Out of stock" : `Only ${esc(p.stockQty)} units left`}</small></span><button class="icon-btn" type="button" data-action="detail" data-key="products" data-index="${d2.products.indexOf(p)}" aria-label="Open ${esc(p.name)}">${svgIcon("chevron", 15)}</button></div>`).join("") || '<div class="empty-state">No low-stock items.</div>'}<button class="btn btn-secondary btn-wide" type="button" data-view="purchase-orders">Review purchasing</button></article></section>
    <section class="inventory-links">${[["stock-counts", "Stock counts", "Count and reconcile inventory", "checklist"], ["stock-transfers", "Stock transfers", "Move stock between branches", "transfer"], ["suppliers", "Suppliers", "Manage vendor contacts", "truck"], ["purchase-orders", "Purchase orders", "Create and approve orders", "purchase"], ["receive-stock", "Receive stock", "Record deliveries", "checklist"]].map(([id, title, detail, ic]) => `<button class="card inventory-link" type="button" data-view="${id}"><span class="link-icon">${svgIcon(ic, 19)}</span><span><b>${title}</b><small>${detail}</small></span>${svgIcon("chevron", 16)}</button>`).join("")}</section>`;
  }
  function renderReceive(meta) {
    const d2 = state.data;
    const open = d2.purchaseOrders.filter((p) => ["Awaiting delivery", "Part received"].includes(p.status));
    const chosen = open.find((p) => p.id === state.receivePo) || open[0];
    const remaining = chosen ? num(chosen.items) - num(chosen.receivedUnits) : 0;
    return `${pageHeading(meta, `<button class="btn btn-secondary" type="button" data-view="purchase-orders">${svgIcon("purchase", 16)} Purchase orders</button>`)}
    <section class="receive-layout"><form class="card receive-form" data-form="receive"><div class="card-head receive-head"><div><h2>Record a delivery</h2><p>Adds the delivered units to your stock.</p></div></div>
      <div class="receive-fields"><label class="form-field"><span>Purchase order <i>*</i></span><select name="purchaseOrder" data-receive-po required>${open.map((p) => `<option value="${esc(p.id)}" ${chosen && p.id === chosen.id ? "selected" : ""}>${esc(p.id)} \xB7 ${esc(p.supplier)}</option>`).join("") || '<option value="" disabled selected>No open purchase orders</option>'}</select></label>
      <label class="form-field"><span>Product <i>*</i></span><select name="sku" required>${d2.products.map((p) => `<option value="${esc(p.sku)}">${esc(p.name)} \xB7 ${esc(p.sku)}</option>`).join("")}</select></label>
      <label class="form-field"><span>Quantity received <i>*</i></span><input name="quantity" type="number" min="1" max="${remaining || ""}" step="1" value="1" required /></label>
      <label class="form-field"><span>Received on</span><input name="receivedAt" type="date" value="${toInputDate(Date.now())}" /></label>
      <label class="form-field span-two"><span>Delivery note</span><input name="note" type="text" placeholder="Optional reference" /></label></div>
      ${chosen ? `<div class="preview-callout">${svgIcon("info", 16)} ${esc(chosen.id)}: ${num(chosen.receivedUnits)} of ${num(chosen.items)} units received \xB7 <b>${remaining} still expected</b>.</div>` : ""}
      <button class="btn btn-primary" type="submit" ${open.length ? "" : "disabled"}>${svgIcon("check", 16)} Record receipt</button></form>
      <section class="card receipt-history"><div class="card-head"><div><h2>Recent receipts</h2><p>Receiving activity</p></div><span class="chart-tag">${d2.receipts.length} records</span></div><div class="receipt-list">${d2.receipts.slice(0, 8).map((r) => `<article class="receipt-row"><span class="receipt-icon">${svgIcon("checklist", 17)}</span><span class="receipt-copy"><b>${esc(r.product)}</b><small>${esc(r.id)} \xB7 ${esc(r.purchaseOrder)}</small></span><span class="receipt-quantity">+${esc(r.quantity)}</span><span class="receipt-date">${esc(fmtDate(r.receivedAt, false))}</span></article>`).join("") || '<div class="empty-state">No receipts yet.</div>'}</div></section></section>`;
  }
  function renderReports(meta) {
    return `${pageHeading(meta, "")}<section class="report-intro card"><div class="report-intro-mark">${svgIcon("report", 24)}</div><div><h2>Reports for a sharper view</h2><p>Pick a report to see live totals, charts and the rows behind them. Figures update as you sell.</p></div>${periodSelect()}</section><section class="report-card-grid">${reportCards.map((c) => `<button type="button" class="card report-card" data-view="${c.id}"><span class="report-icon accent-${c.accent}">${svgIcon(c.icon, 20)}</span><span class="report-card-copy"><b>${esc(c.label)} report</b><small>${esc(c.detail)}</small></span>${svgIcon("chevron", 16)}</button>`).join("")}</section>`;
  }
  function renderReportDetail(meta) {
    const data = reportData(state.view);
    const src = REPORT_SOURCE[state.view];
    const items = data.series.items;
    const max = Math.max(1, ...items.map((i) => i.value));
    const labels = thin(items.map((i) => i.label), 10);
    const fmtV = (v) => data.series.money ? money(v) : v.toLocaleString();
    return `${pageHeading(meta, `<button class="btn btn-secondary" type="button" data-view="reports">${svgIcon("arrow", 16)} All reports</button><button class="btn btn-primary" type="button" data-action="export-report">${svgIcon("download", 16)} Export</button>`)}
    <div class="report-controls card">${periodSelect()}${outletSelect()}<span class="report-sample-note">${esc(state.period)} \xB7 ${esc(state.outlet)}</span></div>
    <section class="report-stats">${data.stats.map((x) => `<article class="card"><span>${esc(x.label)}</span><strong>${x.kind === "money" ? money(x.value) : Number(x.value).toLocaleString()}</strong><small class="${String(x.sub).startsWith("+") ? "positive" : ""}">${esc(x.sub)}</small></article>`).join("")}</section>
    <section class="content-grid report-detail-grid"><article class="card"><div class="card-head"><div><h2>${esc(data.series.title)}</h2><p>${esc(state.period)}</p></div><span class="chart-tag">${esc(data.series.tag)}</span></div><div class="report-bars">${items.length ? items.map((i, n) => `<div class="report-bar" title="${esc(i.label)}: ${esc(fmtV(i.value))}"><i style="height:${Math.max(i.value ? 3 : 0, Math.round(i.value / max * 100))}%"></i><span>${esc(labels[n])}</span></div>`).join("") : '<div class="empty-state">No data for this period.</div>'}</div></article>
      <article class="card"><div class="card-head"><div><h2>${esc(data.breakdown.title)}</h2><p>${esc(data.breakdown.sub)}</p></div></div><div class="payment-breakdown">${data.breakdown.items.map((b) => `<div><span><i class="payment-swatch ${b.color}"></i>${esc(b.label)}</span><b>${data.breakdown.format === "count" ? `${b.value} \xB7 ${b.share}%` : `${b.share}%`}</b></div>`).join("") || '<div class="empty-state">Nothing to break down yet.</div>'}</div></article></section>
    ${renderTableCard(pageMeta[src.page], { dataKey: src.dataKey, report: true })}`;
  }
  function renderAnalytics(meta) {
    const a = analytics();
    const peak = Math.max(1, ...a.momentum.map((p) => p.value));
    const labels = thin(a.momentum.map((p) => p.label), 10);
    return `${pageHeading(meta, `${outletSelect()}${periodSelect()}`)}<section class="analytics-kpis"><article class="card"><span>Gross merchandise value</span><strong>${money(a.net)}</strong><small class="${a.netChange.startsWith("+") ? "positive" : ""}">${esc(a.netChange)} vs previous period</small></article><article class="card"><span>Average basket</span><strong>${money(a.average)}</strong><small>${a.basket} items per sale</small></article><article class="card"><span>Repeat customers</span><strong>${a.repeat}%</strong><small>Named customers with 2+ bills</small></article><article class="card"><span>Sell-through</span><strong>${a.sellThrough}%</strong><small>Units sold vs. units on hand</small></article></section>
    <section class="content-grid analytics-grid"><article class="card"><div class="card-head"><div><h2>Sales momentum</h2><p>Net sales \xB7 ${esc(state.period)}</p></div><span class="growth-pill">${svgIcon("arrow", 14)} ${esc(a.netChange)}</span></div><div class="analytics-bars">${a.momentum.map((p, i) => `<div title="${esc(p.label)}: ${esc(money(p.value))}"><i style="height:${Math.max(p.value ? 3 : 0, Math.round(p.value / peak * 100))}%"></i><span>${esc(labels[i])}</span></div>`).join("")}</div></article>
      <article class="card"><div class="card-head"><div><h2>Best performers</h2><p>Top products by revenue</p></div><button class="text-action" type="button" data-view="order-products">All products ${svgIcon("arrow", 15)}</button></div><div class="performer-list">${a.performers.map((p, i) => `<div class="performer-row"><span class="rank">0${i + 1}</span><span class="performer-name"><b>${esc(p.name)}</b><small>${p.quantity} units sold</small></span><b>${money(p.revenue)}</b></div>`).join("") || '<div class="empty-state">No sales in this period.</div>'}</div></article>
      <article class="card channel-card"><div class="card-head"><div><h2>Sales channels</h2><p>Revenue mix</p></div></div>${a.channels.map((c) => `<div class="channel-row"><span><i class="channel-dot ${c.color}"></i>${esc(c.label)}</span><b>${c.share}%</b><div class="channel-meter ${c.color === "red" ? "" : c.color}"><i style="width:${c.share}%"></i></div></div>`).join("") || '<div class="empty-state">No sales yet.</div>'}</article></section>`;
  }
  function renderAdmin(meta) {
    return `${pageHeading(meta, "")}<section class="admin-summary card"><div class="admin-summary-icon">${svgIcon("settings", 23)}</div><div><h2>Store controls</h2><p>These settings drive the whole app: taxes, payment methods, stock thresholds, loyalty and more.</p></div></section>
    <section class="settings-grid">${settingsSections.map((s) => `<button class="card setting-tile" type="button" data-view="${s.id}"><span class="setting-icon">${svgIcon(s.icon, 19)}</span><span><b>${esc(s.label)}</b><small>${esc(s.detail)}</small></span>${svgIcon("chevron", 16)}</button>`).join("")}</section>
    <section class="card data-card"><div><h2>Your data</h2><p>Everything is stored in this browser for now. Export a backup, or start again from fresh starter data.</p></div><div class="heading-actions"><button class="btn btn-secondary" type="button" data-action="export-all">${svgIcon("download", 16)} Export JSON</button><button class="btn btn-secondary" type="button" data-action="reset-data">${svgIcon("refresh", 16)} Reset data</button></div></section>`;
  }
  function renderSettings(meta) {
    const fields = settingsFields[meta.key] || [];
    const sec = settingsSections.find((x) => x.id === state.view);
    const hint = meta.key === "general" ? '<p class="field-hint">Display currency only changes how amounts are shown (1 USD = 15.42 MVR). Stored amounts stay in MVR.</p>' : "";
    return `${pageHeading(meta, `<button class="btn btn-secondary" type="button" data-view="admin">${svgIcon("arrow", 16)} All settings</button>`)}<section class="settings-layout"><aside class="card settings-nav"><div class="settings-nav-title">Settings</div>${settingsSections.map((x) => `<button class="settings-nav-item ${x.id === state.view ? "active" : ""}" type="button" data-view="${x.id}">${svgIcon(x.icon, 16)}${esc(x.label)}</button>`).join("")}</aside>
    <article class="card settings-form-card"><div class="settings-card-head"><span class="setting-icon">${svgIcon(sec?.icon || "settings", 19)}</span><div><h2>${esc(meta.title)}</h2><p>${esc(meta.subtitle)}</p></div></div><form data-form="settings"><div class="settings-fields">${fields.map(([k, label, type, opts]) => settingField(k, label, type, opts)).join("")}</div>${hint}<div class="settings-save-row"><span>Saved in this browser and applied across the whole app.</span><button class="btn btn-primary" type="submit">Save settings</button></div></form></article></section>`;
  }
  function settingField(key, label, type, options) {
    const value = state.settings[key];
    if (type === "checkbox") return `<label class="setting-check"><input type="checkbox" name="${esc(key)}" ${value ? "checked" : ""} /><span class="toggle"><i></i></span><span>${esc(label)}</span></label>`;
    if (type === "select") return `<label class="form-field"><span>${esc(label)}</span><select name="${esc(key)}">${options.map((o) => `<option ${String(value) === o ? "selected" : ""}>${esc(o)}</option>`).join("")}</select></label>`;
    return `<label class="form-field"><span>${esc(label)}</span><input name="${esc(key)}" type="${esc(type)}" value="${esc(value)}" ${type === "number" ? 'min="0" step="any"' : ""} /></label>`;
  }
  function renderTablePage(meta) {
    const key = meta.dataKey;
    const create = key === "sessions" ? "New session" : CREATE_LABEL[key];
    const extra = key === "onlineOrders" ? `<button class="btn btn-primary" type="button" data-action="simulate-order">${svgIcon("globe", 16)} Simulate online order</button>` : "";
    const buttons = `<button class="btn btn-secondary" type="button" data-action="export">${svgIcon("download", 16)} Export</button>${extra}${create ? `<button class="btn btn-primary" type="button" data-action="create">${svgIcon("plus", 16)} ${esc(create)}</button>` : ""}`;
    return `${pageHeading(meta, buttons)}${renderTableCard(meta, { dataKey: key })}`;
  }
  function queryRows(dataKey, columns, { report = false } = {}) {
    let rows = getRows(dataKey);
    const field = DATE_FIELD[dataKey];
    const range = periodRange(report ? state.period : state.tablePeriod);
    rows = rows.filter(({ row }) => (!field || inRange(row[field], range) || row[field] == null && !report) && (dataKey === "orderProducts" || outletMatches(row)));
    if (state.statusFilter !== "all") rows = rows.filter(({ row }) => row.status === state.statusFilter);
    const q = state.query.trim().toLowerCase();
    if (q) rows = rows.filter(({ row }) => Object.entries(row).some(([k, v]) => k !== "lines" && k !== "activity" && (DATE_COLS.has(k) && typeof v === "number" ? fmtDate(v) : String(v ?? "")).toLowerCase().includes(q)));
    if (state.sort.key && columns.some(([k]) => k === state.sort.key)) {
      const k = state.sort.key;
      const dir = state.sort.dir;
      rows = [...rows].sort((a, b) => {
        const x = a.row[k];
        const y = b.row[k];
        if (typeof x === "number" && typeof y === "number") return (x - y) * dir;
        return String(x ?? "").localeCompare(String(y ?? ""), void 0, { numeric: true, sensitivity: "base" }) * dir;
      });
    }
    return rows;
  }
  function formatCell(key, value, dataKey) {
    if (value == null || value === "") return '<span class="muted-cell">\u2014</span>';
    if (dataKey === "stockCounts" && key === "variance") return `<span>${value} item${Number(value) === 1 ? "" : "s"}</span>`;
    if (key === "variance") return `<span class="money-cell">${signed(value)}</span>`;
    if (DATE_COLS.has(key)) return `<span>${esc(fmtDate(value, !DATE_ONLY(dataKey, key)))}</span>`;
    if (MONEY_COLS.has(key)) return `<span class="money-cell">${money(value)}</span>`;
    if (key === "status") return `<span class="status-pill ${statusClass(value)}">${esc(value)}</span>`;
    if (["name", "customer", "supplier", "register", "description"].includes(key)) return `<span class="primary-cell">${esc(value)}</span>`;
    return `<span>${esc(value)}</span>`;
  }
  function renderTableCard(meta, { dataKey, report = false }) {
    const columns = meta.columns || [];
    const all = queryRows(dataKey, columns, { report });
    const pages = Math.max(1, Math.ceil(all.length / state.pageSize));
    state.page = Math.min(state.page, pages - 1);
    const start = state.page * state.pageSize;
    const visible = all.slice(start, start + state.pageSize);
    const statuses = STATUS_OPTIONS[dataKey] || [...new Set(getRows(dataKey).map((r) => r.row.status).filter(Boolean))];
    const body = visible.map(({ row, index }) => {
      const clickable = index >= 0;
      return `<tr class="${clickable ? "row-click" : ""}" ${clickable ? `data-action="detail" data-key="${esc(dataKey)}" data-index="${index}"` : ""}>${columns.map(([k]) => `<td>${formatCell(k, row[k], dataKey)}</td>`).join("")}<td class="row-actions">${clickable ? `<button class="icon-btn row-menu" type="button" data-action="detail" data-key="${esc(dataKey)}" data-index="${index}" aria-label="Open ${esc(row.id || row.name || row.code || "row")}">${svgIcon("dots", 18)}</button>` : ""}</td></tr>`;
    }).join("");
    const pageButtons = pages <= 1 ? "" : "";
    return `<section class="card table-card ${report ? "report-table" : ""}" id="table-card">
    <div class="table-toolbar"><label class="table-search">${svgIcon("search", 16)}<input type="search" data-page-search placeholder="Search ${esc(meta.title.toLowerCase())}" value="${esc(state.query)}" /></label>
      <div class="table-filters">${statuses.length ? `<select data-status-filter aria-label="Filter by status"><option value="all">All statuses</option>${statuses.map((s) => `<option value="${esc(s)}" ${state.statusFilter === s ? "selected" : ""}>${esc(s)}</option>`).join("")}</select>` : ""}${!report && DATE_FIELD[dataKey] ? `<select data-table-period aria-label="Date range">${TABLE_PERIODS.map((p) => `<option ${state.tablePeriod === p ? "selected" : ""}>${p}</option>`).join("")}</select>` : ""}</div></div>
    <div class="table-scroll"><table><thead><tr>${columns.map(([k, label]) => `<th aria-sort="${state.sort.key === k ? state.sort.dir > 0 ? "ascending" : "descending" : "none"}"><button type="button" class="th-sort" data-sort="${esc(k)}">${esc(label)}<i>${state.sort.key === k ? state.sort.dir > 0 ? "\u2191" : "\u2193" : ""}</i></button></th>`).join("")}<th aria-label="Actions"></th></tr></thead>
    <tbody>${body || `<tr><td colspan="${columns.length + 1}"><div class="empty-state">No ${esc(meta.title.toLowerCase())} match these filters.</div></td></tr>`}</tbody></table></div>
    <div class="table-footer"><span>${all.length ? `Showing ${start + 1}\u2013${Math.min(start + state.pageSize, all.length)} of ${all.length}` : "Showing 0 results"}</span><div class="pagination"><button type="button" class="icon-btn" data-action="page-prev" aria-label="Previous page" ${state.page === 0 ? "disabled" : ""}>${svgIcon("chevron", 15).replace("<svg ", '<svg class="flip-x" ')}</button><span>${state.page + 1} / ${pages}</span><button type="button" class="icon-btn" data-action="page-next" aria-label="Next page" ${state.page >= pages - 1 ? "disabled" : ""}>${svgIcon("chevron", 15)}</button></div></div>${pageButtons}</section>`;
  }
  function renderPage(meta) {
    switch (meta.type) {
      case "home":
        return renderHome(meta);
      case "sell":
        return renderSell(meta);
      case "register":
        return renderRegister(meta);
      case "inventory":
        return renderInventory(meta);
      case "receive":
        return renderReceive(meta);
      case "reports":
        return renderReports(meta);
      case "report":
        return renderReportDetail(meta);
      case "analytics":
        return renderAnalytics(meta);
      case "admin":
        return renderAdmin(meta);
      case "settings":
        return renderSettings(meta);
      default:
        return renderTablePage(meta);
    }
  }

  // ../pos/src/lib/modals.js
  var HIDDEN_KEYS = /* @__PURE__ */ new Set(["lines", "activity", "stockReserved", "stockReleased", "counted"]);
  function shell(title, eyebrow, body, { wide = false, id = "modal-title" } = {}) {
    return `<div class="modal-backdrop" data-action="close-modal"><section class="modal-card ${wide ? "modal-wide" : ""}" role="dialog" aria-modal="true" aria-labelledby="${id}"><div class="modal-head"><div><span class="eyebrow">${esc(eyebrow)}</span><h2 id="${id}">${esc(title)}</h2></div><button type="button" class="icon-btn" data-action="close-modal" aria-label="Close">${svgIcon("close", 18)}</button></div>${body}</section></div>`;
  }
  var errorBox = (m) => m.error ? `<p class="form-error" role="alert">${svgIcon("info", 15)} ${esc(m.error)}</p>` : "";
  function fieldHtml(f2, values = {}) {
    const v = values[f2.name] ?? f2.value ?? "";
    const req = f2.required ? " <i>*</i>" : "";
    const attrs = `name="${esc(f2.name)}" ${f2.required ? "required" : ""} ${f2.min != null ? `min="${f2.min}"` : ""} ${f2.step ? `step="${f2.step}"` : ""}`;
    let control;
    if (f2.type === "select") control = `<select ${attrs}>${(f2.options || []).map((o) => `<option ${String(v) === String(o) ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
    else control = `<input ${attrs} type="${esc(f2.type)}" value="${esc(v)}" ${f2.placeholder ? `placeholder="${esc(f2.placeholder)}"` : ""} />`;
    return `<label class="form-field ${f2.span ? "span-two" : ""}"><span>${esc(f2.label)}${req}</span>${control}</label>`;
  }
  function plain(key, value, dataKey) {
    return formatCell(key, value, dataKey);
  }
  function detailBody(m) {
    const { key } = m;
    const display = getRows(key)[m.index]?.row;
    const row = state.data[key][m.index];
    if (!row) return '<div class="empty-state">This record no longer exists.</div>';
    if (key === "customers") return customerTabs(m, row);
    if (key === "products") return productTabs(m, row);
    if (key === "bills") return billDetail(row);
    const entries = Object.entries(display).filter(([k]) => !HIDDEN_KEYS.has(k));
    let extra = "";
    if (key === "sessions") {
      const st = sessionStats(row);
      extra = `<div class="detail-stat-grid"><article><span>Sales</span><b>${money(st.sales)}</b></article><article><span>Cash</span><b>${money(st.cash)}</b></article><article><span>Card & other</span><b>${money(st.card + st.other)}</b></article></div>`;
    }
    if (row.lines?.length) extra += `<div class="lines-table">${row.lines.map((l) => `<div><span>${esc(l.name)} \xD7 ${l.qty}</span><b>${money(l.price * l.qty)}</b></div>`).join("")}</div>`;
    return `${extra}<div class="detail-list">${entries.map(([k, v]) => `<div><span>${esc(toLabel(k))}</span><b>${plain(k, v, key)}</b></div>`).join("")}</div>`;
  }
  function billDetail(b) {
    return `<div class="detail-profile"><span class="detail-avatar">${svgIcon("receipt", 22)}</span><div><h3>${esc(b.id)}</h3><p>${esc(b.customer)} \xB7 ${esc(fmtDate(b.date))}</p><span class="status-pill ${statusClass(b.status)}">${esc(b.status)}</span></div></div>
    <div class="lines-table">${(b.lines || []).map((l) => `<div><span>${esc(l.name)} \xD7 ${l.qty}</span><b>${money(l.price * l.qty)}</b></div>`).join("") || "<div><span>No itemised lines recorded</span><b></b></div>"}</div>
    <div class="detail-list"><div><span>Payment</span><b>${esc(b.method)}</b></div><div><span>Branch</span><b>${esc(b.outlet || "\u2014")}</b></div><div><span>Discount</span><b>${money(b.discount || 0)}</b></div><div><span>Tax</span><b>${money(b.tax || 0)}</b></div><div><span>Total</span><b>${money(b.total)}</b></div><div><span>Session</span><b>${esc(b.sessionId || "\u2014")}</b></div></div>`;
  }
  function customerTabs(m, row) {
    const tabs = [["profile", "Profile"], ["credit", "Credit"], ["loyalty", "Loyalty"], ["orders", "Bills"]];
    const active = m.tab || "profile";
    let panel;
    if (active === "credit") {
      const bal = num(row.outstanding);
      const limit = num(row.creditLimit || 3e3);
      panel = `<div class="detail-stat-grid"><article><span>Outstanding</span><b>${money(bal)}</b></article><article><span>Credit limit</span><b>${money(limit)}</b></article><article><span>Available</span><b>${money(Math.max(0, limit - bal))}</b></article></div><div class="detail-callout">Credit sales add to the outstanding balance. Use \u201CReceive payment\u201D below when the customer pays.</div>`;
    } else if (active === "loyalty") {
      const pts = num(row.loyalty);
      const tier = pts >= 350 ? "Gold" : pts >= 150 ? "Silver" : "Member";
      panel = `<div class="loyalty-card"><span class="loyalty-mark">${svgIcon("star", 21)}</span><div><small>ADFLARE REWARDS</small><h3>${tier} member</h3><p>Points earned on every sale and redeemable at checkout.</p></div><strong>${pts} <small>points</small></strong></div><div class="detail-stat-grid"><article><span>Visits</span><b>${esc(row.visits || 0)}</b></article><article><span>Points</span><b>${pts}</b></article><article><span>Worth</span><b>${money(Math.floor(pts / 100) * num(state.settings.redemptionValue))}</b></article></div>`;
    } else if (active === "orders") {
      const bills = state.data.bills.filter((b) => b.customer === row.name).slice(0, 12);
      panel = `<div class="detail-orders">${bills.map((b) => `<article><span><b>${esc(b.id)}</b><small>${esc(fmtDate(b.date))} \xB7 ${esc(b.method)}</small></span><strong>${money(b.total)}</strong><i class="status-pill ${statusClass(b.status)}">${esc(b.status)}</i></article>`).join("") || '<div class="empty-state">No bills for this customer yet.</div>'}</div>`;
    } else {
      const ini = (row.name || "C").split(" ").map((p) => p[0]).slice(0, 2).join("");
      panel = `<div class="detail-profile"><span class="detail-avatar">${esc(ini)}</span><div><h3>${esc(row.name)}</h3><p>${esc(row.email || "No email")} \xB7 ${esc(row.mobile || "No phone")}</p><span class="status-pill ${statusClass(row.status)}">${esc(row.status || "Active")}</span></div></div><div class="detail-list"><div><span>Phone</span><b>${esc(row.mobile || "\u2014")}</b></div><div><span>Email</span><b>${esc(row.email || "\u2014")}</b></div><div><span>Address</span><b>${esc(row.address || "\u2014")}</b></div><div><span>Visits</span><b>${esc(row.visits || 0)}</b></div><div><span>Outstanding</span><b>${money(row.outstanding || 0)}</b></div><div><span>Customer since</span><b>${esc(fmtDate(row.joinedAt, false))}</b></div></div>`;
    }
    return tabbed(tabs, active, panel);
  }
  function productTabs(m, row) {
    const tabs = [["overview", "Overview"], ["stock", "Stock"]];
    const active = m.tab || "overview";
    let panel;
    if (active === "stock") panel = `<div class="detail-stat-grid"><article><span>On hand</span><b>${esc(row.stockQty || 0)} units</b></article><article><span>Reorder at</span><b>${esc(state.settings.lowStockThreshold)} units</b></article><article><span>Status</span><b>${esc(row.status || "\u2014")}</b></article></div><div class="detail-callout">Use \u201CAdjust stock\u201D below to correct counts. Sales, receipts and stock counts also update this number.</div>`;
    else panel = `<div class="detail-profile"><span class="detail-avatar">${svgIcon("box", 22)}</span><div><h3>${esc(row.name)}</h3><p>${esc(row.sku)} \xB7 ${esc(row.category)}</p><span class="status-pill ${statusClass(row.status)}">${esc(row.status || "Active")}</span></div></div><div class="detail-list"><div><span>SKU</span><b>${esc(row.sku)}</b></div><div><span>Category</span><b>${esc(row.category)}</b></div><div><span>Price</span><b>${money(row.price || 0)}</b></div><div><span>On hand</span><b>${esc(row.stockQty || 0)} units</b></div></div>`;
    return tabbed(tabs, active, panel);
  }
  var tabbed = (tabs, active, panel) => `<div class="detail-tabs" role="tablist">${tabs.map(([id, label]) => `<button type="button" role="tab" aria-selected="${active === id}" aria-controls="record-detail-panel" class="detail-tab ${active === id ? "active" : ""}" data-detail-tab="${id}">${label}</button>`).join("")}</div><div class="detail-tab-panel" id="record-detail-panel" role="tabpanel" tabindex="0">${panel}</div>`;
  function renderDetail(m) {
    const row = state.data[m.key]?.[m.index];
    const acts = row ? rowActions(m.key, row) : [];
    const title = row ? row.id || row.name || row.code || row.sku || "Record" : "Record";
    const buttons = [
      ...acts.map((a) => `<button type="button" class="btn ${a.danger ? "btn-danger" : "btn-secondary"}" data-action="row-action" data-act="${a.id}" data-key="${esc(m.key)}" data-index="${m.index}">${svgIcon(a.icon, 15)} ${esc(a.label)}</button>`),
      EDITABLE.has(m.key) ? `<button type="button" class="btn btn-secondary" data-action="edit-record" data-key="${esc(m.key)}" data-index="${m.index}">${svgIcon("edit", 15)} Edit</button>` : "",
      DELETABLE.has(m.key) ? `<button type="button" class="btn btn-danger" data-action="delete-record" data-key="${esc(m.key)}" data-index="${m.index}">${svgIcon("trash", 15)} Delete</button>` : ""
    ].join("");
    return shell(String(title), "DETAILS", `${detailBody(m)}<div class="modal-actions">${buttons}</div><div class="modal-foot"><span class="modal-hint">Saved automatically</span><button class="btn btn-secondary" type="button" data-action="close-modal">Done</button></div>`, { wide: true });
  }
  function renderForm(m, mode) {
    const row = mode === "edit" ? state.data[m.key][m.index] : null;
    const fields = getFields(m.key, row || void 0).map((f2) => m.values && m.values[f2.name] !== void 0 && !m.error ? { ...f2, value: m.values[f2.name] } : f2);
    const title = mode === "edit" ? `Edit ${row?.name || row?.id || row?.code || row?.sku || "record"}` : m.key === "sessions" ? "New session" : CREATE_LABEL[m.key] || "New item";
    return shell(title, mode === "edit" ? "EDIT" : "NEW", `<form data-form="${mode}"><div class="form-grid">${fields.map((f2) => fieldHtml(f2, m.error ? m.values : {})).join("")}</div>${errorBox(m)}<div class="modal-foot"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">${mode === "edit" ? "Save changes" : "Add"}</button></div></form>`);
  }
  function renderPrompt(m) {
    return shell(m.title, "ACTION", `<form data-form="prompt">${m.hint ? `<p class="modal-lead">${esc(m.hint)}</p>` : ""}<div class="form-grid">${m.fields.map((f2) => fieldHtml(f2, m.error ? m.values : {})).join("")}</div>${errorBox(m)}<div class="modal-foot"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Confirm</button></div></form>`);
  }
  function renderConfirm(m) {
    return shell(m.title || "Are you sure?", "CONFIRM", `<p class="modal-lead">${esc(m.message)}</p>${errorBox(m)}<div class="modal-foot"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn ${m.danger === false ? "btn-primary" : "btn-danger"}" type="button" data-action="confirm-yes">${esc(m.confirmLabel || "Confirm")}</button></div>`);
  }
  function renderCheckout(m) {
    const t = cartTotals();
    const methods = paymentMethods();
    const sel = m.values?.method && methods.includes(m.values.method) ? m.values.method : methods[0];
    const cards = state.data.giftCards.filter((g) => g.status === "Active" && num(g.balance) > 0);
    const cust = t.customer;
    const avail = cust ? num(cust.creditLimit || 3e3) - num(cust.outstanding) : 0;
    return shell("Checkout", "COMPLETE SALE", `<div class="checkout-total"><span>Total to collect</span><b>${money(t.total)}</b></div>
    <form data-form="checkout"><div class="method-grid" role="radiogroup" aria-label="Payment method">${methods.map((x) => `<label class="method-chip"><input type="radio" name="method" value="${esc(x)}" ${x === sel ? "checked" : ""} /><span>${esc(x)}</span></label>`).join("")}</div>
      <div data-method-section="Cash" ${sel === "Cash" ? "" : "hidden"}><label class="form-field"><span>Cash received</span><input name="tendered" type="number" min="0" step="any" value="${esc(m.values?.tendered ?? t.total)}" data-tendered data-total="${t.total}" /></label><div class="change-row"><span>Change due</span><b data-change>${money(0)}</b></div></div>
      <div data-method-section="Gift card" ${sel === "Gift card" ? "" : "hidden"}><label class="form-field"><span>Gift card</span><select name="giftCode">${cards.map((g) => `<option value="${esc(g.code)}">${esc(g.code)} \xB7 ${money(g.balance)}</option>`).join("") || '<option value="">No active gift cards</option>'}</select></label></div>
      <div data-method-section="Credit" ${sel === "Credit" ? "" : "hidden"}><div class="preview-callout">${svgIcon("info", 16)} ${cust ? `${esc(cust.name)} has ${money(Math.max(0, avail))} credit available.` : "Select a saved customer on the Sell page to use credit."}</div></div>
      <div data-method-section="Card" ${sel === "Card" ? "" : "hidden"}><div class="preview-callout">${svgIcon("info", 16)} No card terminal is connected. The sale is recorded as paid by card.</div></div>
      <div data-method-section="Transfer" ${sel === "Transfer" ? "" : "hidden"}><div class="preview-callout">${svgIcon("info", 16)} Record the sale as paid by bank transfer.</div></div>
      <label class="form-field"><span>Customer</span><input value="${esc(state.cartCustomer)}" disabled /></label>
      <label class="form-field"><span>Note (optional)</span><input name="note" value="${esc(m.values?.note || "")}" placeholder="Add a note to the receipt" /></label>${errorBox(m)}
      <div class="modal-foot"><button type="button" class="btn btn-secondary" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-primary">Complete sale \xB7 ${money(t.total)}</button></div></form>`);
  }
  function renderReceipt(m) {
    const b = state.data.bills.find((x) => x.id === m.billId);
    if (!b) return shell("Receipt", "RECEIPT", '<div class="empty-state">Receipt not found.</div>');
    const s = state.settings;
    const body = `<div class="receipt" id="receipt-print"><div class="receipt-top"><b>${esc(s.storeName)}</b><small>${esc(s.address)}</small><small>${esc(s.phone)}</small></div>
    ${b.status !== "Completed" && b.status !== "Pending" ? `<div class="receipt-void">${esc(b.status.toUpperCase())}</div>` : ""}
    <div class="receipt-meta"><div><span>Bill</span><b>${esc(b.id)}</b></div><div><span>Date</span><b>${esc(fmtDate(b.date))}</b></div><div><span>Customer</span><b>${esc(b.customer)}</b></div><div><span>Cashier</span><b>Adflare Owner</b></div></div>
    <div class="receipt-lines">${(b.lines || []).map((l) => `<div><span>${esc(l.name)}<small>${l.qty} \xD7 ${money(l.price)}</small></span><b>${money(l.price * l.qty)}</b></div>`).join("") || "<div><span>Items</span><b>\u2014</b></div>"}</div>
    <div class="receipt-sum"><div><span>Subtotal</span><b>${money(b.subtotal ?? b.total)}</b></div>${num(b.discount) ? `<div><span>Discount</span><b>\u2212${money(b.discount)}</b></div>` : ""}${num(b.serviceFee) ? `<div><span>Service fee</span><b>${money(b.serviceFee)}</b></div>` : ""}<div><span>${s.pricesIncludeTax ? "Tax included" : "Tax"}</span><b>${money(b.tax || 0)}</b></div><div class="receipt-total"><span>Total</span><b>${money(b.total)}</b></div><div><span>Paid by</span><b>${esc(b.method)}${b.giftCode ? ` (${esc(b.giftCode)})` : ""}</b></div>${b.tendered != null ? `<div><span>Cash received</span><b>${money(b.tendered)}</b></div><div><span>Change</span><b>${money(b.change || 0)}</b></div>` : ""}${b.status === "Pending" ? "<div><span>Status</span><b>Unpaid (on account)</b></div>" : ""}${num(b.pointsEarned) ? `<div><span>Points earned</span><b>${b.pointsEarned}</b></div>` : ""}</div>
    ${b.note ? `<p class="receipt-note">${esc(b.note)}</p>` : ""}<p class="receipt-thanks">Thank you for shopping with us!</p></div>
    <div class="modal-foot no-print"><button class="btn btn-secondary" type="button" data-action="print-receipt">${svgIcon("print", 15)} Print</button><button class="btn btn-primary" type="button" data-action="close-modal">${m.fresh ? "New sale" : "Done"}</button></div>`;
    return shell(m.fresh ? "Sale complete" : "Receipt", m.fresh ? "SUCCESS" : "RECEIPT", body);
  }
  function renderOpenRegister(m) {
    return shell("Open register", "REGISTER", `<form data-form="open-register"><div class="form-grid"><label class="form-field"><span>Register</span><select name="register">${["Front counter", "Branch 1 counter"].map((r) => `<option ${m.values?.register === r ? "selected" : ""}>${r}</option>`).join("")}</select></label><label class="form-field"><span>Opening float (MVR) <i>*</i></span><input name="openingFloat" type="number" min="0" step="any" value="${esc(m.values?.openingFloat ?? 1500)}" required /></label><label class="form-field span-two"><span>Opened by</span><input name="openedBy" value="${esc(m.values?.openedBy ?? "Adflare Owner")}" /></label></div>${errorBox(m)}<div class="modal-foot"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Open register</button></div></form>`);
  }
  function renderCloseRegister(m) {
    const s = state.data.sessions.find((x) => x.id === m.sessionId);
    const st = s ? sessionStats(s) : { expected: 0, sales: 0, count: 0 };
    return shell("Close register", s ? s.id : "REGISTER", `<form data-form="close-register"><div class="detail-stat-grid"><article><span>Sales (${st.count})</span><b>${money(st.sales)}</b></article><article><span>Opening float</span><b>${money(s?.openingFloat || 0)}</b></article><article><span>Expected cash</span><b>${money(st.expected)}</b></article></div>
    <label class="form-field"><span>Cash counted in drawer <i>*</i></span><input name="counted" type="number" min="0" step="any" value="${esc(m.values?.counted ?? st.expected)}" data-counted data-expected="${st.expected}" required /></label><div class="change-row"><span>Variance</span><b data-variance>${signed(0)}</b></div>${errorBox(m)}
    <div class="modal-foot"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Close register</button></div></form>`);
  }
  function renderCashMove(m) {
    return shell("Cash in / out", "REGISTER", `<form data-form="cash-move"><div class="form-grid"><label class="form-field"><span>Type</span><select name="kind"><option value="in" ${m.values?.kind === "in" ? "selected" : ""}>Cash in</option><option value="out" ${m.values?.kind === "out" ? "selected" : ""}>Cash out</option></select></label><label class="form-field"><span>Amount (MVR) <i>*</i></span><input name="amount" type="number" min="0" step="any" value="${esc(m.values?.amount ?? "")}" required /></label><label class="form-field span-two"><span>Reason</span><input name="reason" value="${esc(m.values?.reason ?? "")}" placeholder="e.g. Bank drop, change top-up" /></label></div>${errorBox(m)}<div class="modal-foot"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Save</button></div></form>`);
  }
  function renderCount(m) {
    const sc = state.data.stockCounts[m.index];
    return shell(`Count sheet \xB7 ${sc?.id || ""}`, "STOCK COUNT", `<form data-form="count"><p class="modal-lead">Enter what you actually counted. Differences are applied to stock when you finish.</p><div class="count-table"><div class="count-head"><span>Product</span><span>System</span><span>Counted</span></div>${state.data.products.map((p) => `<div><span><b>${esc(p.name)}</b><small>${esc(p.sku)}</small></span><span>${num(p.stockQty)}</span><input type="number" min="0" step="1" name="${esc(p.sku)}" value="${esc(m.values?.[p.sku] ?? p.stockQty)}" aria-label="Counted ${esc(p.name)}" /></div>`).join("")}</div>${errorBox(m)}<div class="modal-foot"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Finish count</button></div></form>`, { wide: true });
  }
  function renderModal() {
    const m = state.modal;
    if (!m) return "";
    switch (m.type) {
      case "detail":
        return renderDetail(m);
      case "create":
        return renderForm(m, "create");
      case "edit":
        return renderForm(m, "edit");
      case "prompt":
        return renderPrompt(m);
      case "confirm":
        return renderConfirm(m);
      case "checkout":
        return renderCheckout(m);
      case "receipt":
        return renderReceipt(m);
      case "open-register":
        return renderOpenRegister(m);
      case "close-register":
        return renderCloseRegister(m);
      case "cash-move":
        return renderCashMove(m);
      case "count":
        return renderCount(m);
      default:
        return "";
    }
  }

  // ../pos/src/app.js
  var app = document.querySelector("#app");
  var sessionUser = (() => {
    try {
      return sessionStorage.getItem("afpos-session") || "";
    } catch (e) {
      return "";
    }
  })();
  if (!sessionUser) location.replace("pos.html");
  else boot();
  function boot() {
    setUser(sessionUser);
    initState();
    const hashView = decodeURIComponent(location.hash.slice(1));
    if (pageMeta[hashView]) state.view = hashView;
    hooks.render = rootRender;
    rootRender();
    app.addEventListener("click", onClick);
    app.addEventListener("input", onInput);
    app.addEventListener("change", onChange);
    app.addEventListener("submit", onSubmit);
    document.addEventListener("keydown", onKeydown);
    window.addEventListener("hashchange", () => {
      const v = decodeURIComponent(location.hash.slice(1));
      if (pageMeta[v] && v !== state.view) go(v);
    });
  }
  function rootRender() {
    const meta = pageMeta[state.view] || pageMeta.home;
    const hadDialogFocus = Boolean(app.querySelector('[role="dialog"]')?.contains(document.activeElement));
    const scroll = app.querySelector(".modal-card")?.scrollTop || 0;
    app.innerHTML = `
    <div class="app-shell ${state.mobileNav ? "nav-open" : ""}">
      <div class="mobile-scrim" data-action="close-nav"></div>
      ${renderSidebar()}
      <section class="workspace">
        ${renderTopbar(meta)}
        <main class="page-content" id="page-content">${renderNotice()}${renderPage(meta)}</main>
      </section>
      ${state.modal ? renderModal() : ""}
    </div>`;
    if (state.modal) {
      const dialog = app.querySelector('[role="dialog"]');
      if (dialog) {
        const card = app.querySelector(".modal-card");
        if (card) card.scrollTop = scroll;
        const target = hadDialogFocus && state.modal.tab ? dialog.querySelector(`[data-detail-tab="${CSS.escape(state.modal.tab)}"]`) : hadDialogFocus ? null : dialog.querySelector('input:not([type="hidden"]):not([type="radio"]):not(:disabled), select, textarea, [data-detail-tab][aria-selected="true"], .modal-foot .btn-primary');
        target?.focus();
        syncDynamicModal();
      }
    } else if (state.restoreFocusSelector) {
      app.querySelector(state.restoreFocusSelector)?.focus();
      state.restoreFocusSelector = null;
    }
  }
  function tableCtx() {
    const report = REPORT_SOURCE[state.view];
    if (report) return { meta: pageMeta[report.page], dataKey: report.dataKey, report: true };
    const meta = pageMeta[state.view];
    return meta?.dataKey ? { meta, dataKey: meta.dataKey, report: false } : null;
  }
  function refreshTable(focusSel) {
    const ctx = tableCtx();
    const old = app.querySelector("#table-card");
    if (!ctx || !old) return rootRender();
    const active = focusSel && document.activeElement?.matches(focusSel) ? document.activeElement : null;
    const pos = active?.selectionStart;
    const wrap = document.createElement("div");
    wrap.innerHTML = renderTableCard(ctx.meta, { dataKey: ctx.dataKey, report: ctx.report });
    old.replaceWith(wrap.firstElementChild);
    if (active) {
      const next = app.querySelector(focusSel);
      next?.focus();
      if (pos != null) next?.setSelectionRange?.(pos, pos);
    }
  }
  function refreshCart(focusSel) {
    const old = app.querySelector(".cart-panel");
    if (!old) return rootRender();
    const active = focusSel && document.activeElement?.matches(focusSel) ? document.activeElement : null;
    const pos = active?.selectionStart;
    const wrap = document.createElement("div");
    wrap.innerHTML = renderCartPanel();
    old.replaceWith(wrap.firstElementChild);
    if (active) {
      const next = app.querySelector(focusSel);
      next?.focus();
      try {
        if (pos != null) next.setSelectionRange(pos, pos);
      } catch (e) {
      }
    }
  }
  function refreshProducts() {
    const grid = app.querySelector(".product-grid");
    if (!grid) return rootRender();
    const track = state.settings.trackStock !== false && !state.settings.allowNegativeStock;
    const q = state.productQuery.toLowerCase();
    const list = state.data.products.filter((p) => p.status !== "Archived" && `${p.name} ${p.category} ${p.sku}`.toLowerCase().includes(q) && (state.productCategory === "all" || p.category === state.productCategory) && (!state.inStockOnly || num(p.stockQty) > 0));
    grid.innerHTML = renderProductTiles(list, track);
    app.querySelectorAll("[data-category]").forEach((c) => c.classList.toggle("active", c.dataset.category === state.productCategory));
  }
  function refreshTopbar() {
    const old = app.querySelector(".topbar");
    if (!old) return;
    const had = document.activeElement?.matches("[data-global-search]");
    const pos = document.activeElement?.selectionStart;
    const wrap = document.createElement("div");
    wrap.innerHTML = renderTopbar(pageMeta[state.view] || pageMeta.home);
    old.replaceWith(wrap.firstElementChild);
    if (had) {
      const i = app.querySelector("[data-global-search]");
      i?.focus();
      if (pos != null) i?.setSelectionRange(pos, pos);
    }
  }
  function syncDynamicModal() {
    const t = app.querySelector("[data-tendered]");
    if (t) updateChange(t);
    const c = app.querySelector("[data-counted]");
    if (c) updateVariance(c);
  }
  function updateChange(input) {
    const total = Number(input.dataset.total);
    const val = input.value === "" ? total : Number(input.value);
    const el = app.querySelector("[data-change]");
    if (el) el.textContent = val >= total ? money(val - total) : `Short ${money(total - val)}`;
  }
  function updateVariance(input) {
    const v = Number(input.value || 0) - Number(input.dataset.expected);
    const el = app.querySelector("[data-variance]");
    if (el) el.textContent = `${v > 0 ? "+" : ""}${(Math.round(v * 100) / 100).toLocaleString("en-US")}`;
  }
  var closeModal = () => {
    state.restoreFocusSelector = state.modalReturnSelector;
    state.modalReturnSelector = null;
    state.modal = null;
  };
  var openModal = (modal, returnSel = null) => {
    state.modalReturnSelector = returnSel;
    state.modal = modal;
    rootRender();
  };
  function fail(message) {
    if (state.modal && ["create", "edit", "prompt", "confirm", "checkout", "open-register", "close-register", "cash-move", "count"].includes(state.modal.type)) {
      state.modal.error = message;
      rootRender();
    } else toast(message, "warn");
  }
  function applyResult(res) {
    if (res.error) return fail(res.error);
    closeModal();
    if (res.next?.view) go(res.next.view);
    if (res.next?.receivePo) state.receivePo = res.next.receivePo;
    if (res.next?.modal) state.modal = res.next.modal;
    rootRender();
    if (res.message) toast(res.message);
  }
  function formValues(form) {
    const values = {};
    new FormData(form).forEach((v, k) => {
      values[k] = v;
    });
    return values;
  }
  function openRowAction(key, index, actId) {
    const row = state.data[key][index];
    const act = rowActions(key, row).find((a) => a.id === actId);
    if (!act) return;
    if (act.prompt) return openModal({ type: "prompt", title: act.label, fields: act.prompt, hint: act.hint, key, index, act: act.id });
    if (act.confirm) return openModal({ type: "confirm", title: act.label, message: act.confirm, confirmLabel: act.label, onConfirm: { kind: "row", key, index, act: act.id } });
    applyResult(runRowAction(key, index, act.id));
  }
  var exportCurrent = () => {
    const ctx = tableCtx();
    if (!ctx) return;
    const rows = queryRows(ctx.dataKey, ctx.meta.columns || [], { report: ctx.report }).map((r) => r.row);
    exportCsv(state.view, ctx.meta.columns || [], rows, ctx.dataKey);
    toast(`Exported ${rows.length} row${rows.length === 1 ? "" : "s"} to CSV.`);
  };
  function switchDetailTab(id) {
    const card = app.querySelector('.modal-card');
    const tabsEl = card && card.querySelector('.detail-tabs');
    const panel = card && card.querySelector('.detail-tab-panel');
    if (!tabsEl || !panel) { state.modal.tab = id; return rootRender(); }
    const btns = Array.from(tabsEl.querySelectorAll('[data-detail-tab]'));
    const from = btns.findIndex((b) => b.classList.contains('active'));
    const to = btns.findIndex((b) => b.dataset.detailTab === id);
    if (to < 0 || to === from) return;
    state.modal.tab = id;
    const tmp = document.createElement('div'); tmp.innerHTML = renderModal();
    const next = tmp.querySelector('.detail-tab-panel');
    if (!next) return rootRender();
    btns.forEach((b, i) => { b.classList.toggle('active', i === to); b.setAttribute('aria-selected', String(i === to)); });
    btns[to].scrollIntoView({ inline: 'nearest', block: 'nearest' });
    panel.innerHTML = next.innerHTML;
    panel.classList.remove('slide-next', 'slide-prev'); void panel.offsetWidth;
    panel.classList.add(to > from ? 'slide-next' : 'slide-prev');
  }

  function onClick(event) {
    const t = event.target;
    if (state.popover && !t.closest(".pop-anchor")) {
      state.popover = null;
      rootRender();
    }
    if (state.gq && !t.closest(".gs-wrap")) {
      state.gq = "";
      refreshTopbar();
    }
    const outlet = t.closest("[data-outlet-choice]");
    if (outlet) {
      state.outlet = outlet.dataset.outletChoice;
      state.outletMenuOpen = false;
      state.page = 0;
      save();
      rootRender();
      app.querySelector('[data-action="outlet-menu"]')?.focus();
      toast(`Showing ${state.outlet}.`);
      return;
    }
    const tab = t.closest("[data-detail-tab]");
    if (tab && state.modal) {
      switchDetailTab(tab.dataset.detailTab);
      return;
    }
    const cat = t.closest("[data-category]");
    if (cat) {
      state.productCategory = cat.dataset.category;
      refreshProducts();
      return;
    }
    const sort = t.closest("[data-sort]");
    if (sort) {
      const k = sort.dataset.sort;
      state.sort = state.sort.key === k ? { key: k, dir: -state.sort.dir } : { key: k, dir: 1 };
      state.page = 0;
      refreshTable();
      return;
    }
    const nav = t.closest("[data-view]");
    if (nav) {
      const status = nav.dataset.status;
      go(nav.dataset.view);
      if (status) {
        state.statusFilter = status;
        rootRender();
      }
      return;
    }
    const btn = t.closest("[data-action]");
    if (!btn) return;
    const a = btn.dataset.action;
    const ds = btn.dataset;
    switch (a) {
      case "close-nav":
        state.mobileNav = false;
        return rootRender();
      case "toggle-nav":
        state.mobileNav = !state.mobileNav;
        return rootRender();
      case "close-pop":
        state.popover = null;
        return rootRender();
      case "close-modal":
        if (!btn.classList.contains("modal-backdrop") || t === btn) {
          closeModal();
          rootRender();
        }
        return;
      case "outlet-menu":
        state.outletMenuOpen = !state.outletMenuOpen;
        rootRender();
        return app.querySelector(state.outletMenuOpen ? '[data-outlet-choice][aria-checked="true"]' : '[data-action="outlet-menu"]')?.focus();
      case "notifications":
        state.popover = state.popover === "notif" ? null : "notif";
        return rootRender();
      case "profile-menu":
        state.popover = state.popover === "profile" ? null : "profile";
        return rootRender();
      case "mark-seen":
        state.notifSeen = notificationSignature();
        save();
        return rootRender();
      case "logout":
        flush();
        sessionStorage.removeItem("afpos-session");
        location.replace("pos.html");
        return;
      case "reset-data":
        return openModal({ type: "confirm", title: "Reset data", message: "This replaces everything in this account with fresh starter data. Your changes will be lost.", confirmLabel: "Reset data", onConfirm: { kind: "reset" } });
      case "export-all":
        exportAllJson();
        toast("Exported all data.");
        state.popover = null;
        return rootRender();
      case "export":
        return exportCurrent();
      case "export-report":
        return exportCurrent();
      case "export-products":
        exportCsv("products", pageMeta.products.columns, state.data.products, "products");
        return toast("Exported products to CSV.");
      case "page-prev":
        state.page = Math.max(0, state.page - 1);
        return refreshTable();
      case "page-next":
        state.page += 1;
        return refreshTable();
      case "create": {
        if (state.view === "sessions") return openModal({ type: "open-register" }, '[data-action="create"]');
        const key = pageMeta[state.view]?.dataKey;
        if (!key) return;
        return openModal({ type: "create", key }, '[data-action="create"]');
      }
      case "new-stock-count":
        go("stock-counts");
        return openModal({ type: "create", key: "stockCounts" });
      case "detail": {
        const list = state.data[ds.key] || [];
        if (!list[Number(ds.index)]) return;
        return openModal({ type: "detail", key: ds.key, index: Number(ds.index), tab: null }, `[data-action="detail"][data-key="${ds.key}"][data-index="${ds.index}"]`);
      }
      case "gs-open": {
        const { view, key, index } = ds;
        state.gq = "";
        go(view);
        return openModal({ type: "detail", key, index: Number(index) });
      }
      case "row-action":
        return openRowAction(ds.key, Number(ds.index), ds.act);
      case "edit-record":
        return openModal({ type: "edit", key: ds.key, index: Number(ds.index) });
      case "delete-record": {
        const row = state.data[ds.key][Number(ds.index)];
        return openModal({ type: "confirm", title: "Delete record", message: `Delete ${row?.name || row?.id || row?.code || row?.sku || "this record"}? This can't be undone.`, confirmLabel: "Delete", onConfirm: { kind: "delete", key: ds.key, index: Number(ds.index) } });
      }
      case "confirm-yes": {
        const c = state.modal?.onConfirm;
        if (!c) return;
        if (c.kind === "reset") {
          resetData();
          closeModal();
          go("home");
          return toast("Data reset.");
        }
        if (c.kind === "delete") {
          const err = deleteRecord(c.key, c.index);
          if (err) return fail(err);
          closeModal();
          rootRender();
          return toast("Deleted.");
        }
        return applyResult(runRowAction(c.key, c.index, c.act));
      }
      case "add-cart": {
        const r = addToCart(ds.id);
        if (r === null) {
          refreshCart();
          toast("Added to sale.");
        }
        return;
      }
      case "qty-up":
      case "qty-down":
        updateCart(ds.id || null, a === "qty-up" ? 1 : -1, ds.name);
        return refreshCart();
      case "clear-cart":
        clearCart();
        return rootRender();
      case "product-filter":
        state.inStockOnly = !state.inStockOnly;
        return rootRender();
      case "checkout":
        if (!state.cart.length) return;
        if (!openSession()) {
          toast("Open the register to complete a sale.", "warn");
          return openModal({ type: "open-register" });
        }
        return openModal({ type: "checkout" }, '[data-action="checkout"]');
      case "save-quote": {
        const r = saveCartAsQuote();
        if (r && r.startsWith("The")) return toast(r, "warn");
        rootRender();
        return toast(`${r} saved. Find it under Quotations.`);
      }
      case "open-register-modal":
        return openModal({ type: "open-register" });
      case "close-register-modal": {
        const s = openSession();
        return s && openModal({ type: "close-register", sessionId: s.id });
      }
      case "cash-move-modal":
        return openModal({ type: "cash-move" });
      case "print-receipt":
        return window.print();
      case "simulate-order": {
        const r = simulateOnlineOrder();
        if (r.startsWith("No")) return toast(r, "warn");
        rootRender();
        return toast(`${r} received.`);
      }
      default:
    }
  }
  function onInput(event) {
    const t = event.target;
    if (t.matches("[data-page-search]")) {
      state.query = t.value;
      state.page = 0;
      refreshTable("[data-page-search]");
    } else if (t.matches("[data-global-search]")) {
      state.gq = t.value;
      refreshTopbar();
    } else if (t.matches("[data-product-search]")) {
      state.productQuery = t.value;
      refreshProducts();
    } else if (t.matches("[data-cart-discount]")) {
      state.cartDiscount = t.value;
      save();
      refreshCart("[data-cart-discount]");
    } else if (t.matches("[data-tendered]")) updateChange(t);
    else if (t.matches("[data-counted]")) updateVariance(t);
  }
  function onChange(event) {
    const t = event.target;
    if (t.matches("[data-status-filter]")) {
      state.statusFilter = t.value;
      state.page = 0;
      refreshTable();
    } else if (t.matches("[data-table-period]")) {
      state.tablePeriod = t.value;
      state.page = 0;
      refreshTable();
    } else if (t.matches("[data-home-filter]")) {
      const k = t.dataset.homeFilter;
      state[k] = t.value;
      state.page = 0;
      save();
      rootRender();
      app.querySelector(`[data-home-filter="${k}"]`)?.focus();
    } else if (t.matches("[data-chart-metric]")) {
      state.chartMetric = t.value;
      rootRender();
    } else if (t.matches("[data-cart-customer]")) {
      state.cartCustomer = t.value;
      state.redeemPoints = false;
      save();
      refreshCart();
    } else if (t.matches("[data-cart-discount-type]")) {
      state.cartDiscountType = t.value;
      refreshCart();
    } else if (t.matches("[data-cart-redeem]")) {
      state.redeemPoints = t.checked;
      refreshCart();
    } else if (t.matches("[data-receive-po]")) {
      state.receivePo = t.value;
      rootRender();
    } else if (t.name === "method" && t.type === "radio") {
      app.querySelectorAll("[data-method-section]").forEach((el) => {
        el.hidden = el.dataset.methodSection !== t.value;
      });
      if (state.modal) state.modal.error = null;
      app.querySelector(".form-error")?.remove();
    }
  }
  function onSubmit(event) {
    const form = event.target.closest("form[data-form]");
    if (!form) return;
    event.preventDefault();
    const type = form.dataset.form;
    const values = formValues(form);
    const m = state.modal;
    const withErr = (err) => {
      if (err) {
        m.error = err;
        m.values = values;
        rootRender();
        return true;
      }
      return false;
    };
    switch (type) {
      case "create": {
        if (withErr(createRecord(m.key, values))) return;
        const label = m.key;
        closeModal();
        rootRender();
        return toast(`Added to ${label.replace(/([A-Z])/g, " $1").toLowerCase()}.`);
      }
      case "edit": {
        if (withErr(updateRecord(m.key, m.index, values))) return;
        closeModal();
        rootRender();
        return toast("Changes saved.");
      }
      case "prompt": {
        const res = runRowAction(m.key, m.index, m.act, values);
        if (res.error) {
          m.error = res.error;
          m.values = values;
          return rootRender();
        }
        return applyResult(res);
      }
      case "checkout": {
        if (withErr(completeSale(values))) return;
        rootRender();
        return toast("Sale completed.");
      }
      case "receive": {
        const err = receiveStock(values);
        if (err) return toast(err, "warn");
        rootRender();
        return toast("Receipt recorded. Stock updated.");
      }
      case "open-register": {
        if (withErr(openRegister(values))) return;
        closeModal();
        rootRender();
        return toast("Register opened.");
      }
      case "close-register": {
        if (withErr(closeRegister(m.sessionId, values))) return;
        const s = state.data.sessions.find((x) => x.id === m.sessionId);
        closeModal();
        rootRender();
        return toast(`Register closed. Variance ${s.variance > 0 ? "+" : ""}${s.variance}.`);
      }
      case "cash-move": {
        if (withErr(cashMove(values))) return;
        closeModal();
        rootRender();
        return toast("Cash movement recorded.");
      }
      case "count": {
        if (withErr(applyStockCount(m.index, values))) return;
        closeModal();
        rootRender();
        return toast("Stock count completed. Stock updated.");
      }
      case "settings": {
        const meta = pageMeta[state.view];
        const fields = meta && pageMetaSettings(meta.key) || [];
        const err = saveSettings(fields, values);
        if (err) return toast(err, "warn");
        rootRender();
        return toast("Settings saved.");
      }
      default:
    }
  }
  var pageMetaSettings = (key) => settingsFields[key];
  function onKeydown(event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      app.querySelector("[data-global-search]")?.focus();
      return;
    }
    if (event.key === "Enter" && event.target.matches?.("[data-product-search]")) {
      event.preventDefault();
      const q = state.productQuery.trim().toLowerCase();
      if (!q) return;
      const hits = state.data.products.filter((p) => p.sku.toLowerCase() === q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
      const exact = hits.find((p) => p.sku.toLowerCase() === q) || (hits.length === 1 ? hits[0] : null);
      if (exact) {
        if (addToCart(exact.sku) === null) {
          state.productQuery = "";
          rootRender();
          toast(`${exact.name} added.`);
          app.querySelector("[data-product-search]")?.focus();
        }
      }
      return;
    }
    if (event.key === "Escape") {
      if (state.modal) {
        closeModal();
        rootRender();
      } else if (state.popover) {
        state.popover = null;
        rootRender();
      } else if (state.mobileNav) {
        state.mobileNav = false;
        rootRender();
      } else if (state.outletMenuOpen) {
        state.outletMenuOpen = false;
        rootRender();
        app.querySelector('[data-action="outlet-menu"]')?.focus();
      } else if (state.gq) {
        state.gq = "";
        refreshTopbar();
      }
    }
    if (event.key === "Tab" && state.modal) {
      const dialog = app.querySelector('[role="dialog"]');
      const focusable = [...dialog?.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])') || []].filter((el) => el.getClientRects().length);
      if (!focusable.length) {
        event.preventDefault();
        dialog?.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    }
  }
})();
