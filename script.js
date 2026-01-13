// تعريف المتغيرات الأساسية
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
let currentFilter = 'all';
let displayedProducts = 6;

// العناصر في DOM
const productsContainer = document.getElementById('productsContainer');
const cartSidebar = document.getElementById('cartSidebar');
const cartIcon = document.getElementById('cartIcon');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
const filterButtons = document.querySelectorAll('.filter-btn');
const orderForm = document.getElementById('orderForm');
const cartSummary = document.getElementById('cartSummary');
const formProductsTotal = document.getElementById('formProductsTotal');
const formShippingCost = document.getElementById('formShippingCost');
const formGrandTotal = document.getElementById('formGrandTotal');
const shippingSelect = document.getElementById('shipping');
const viewMoreBtn = document.getElementById('viewMoreBtn');
const scrollTopBtn = document.getElementById('scrollTop');
const counters = document.querySelectorAll('.counter');

// تهيئة الموقع عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCart();
    setupEventListeners();
    updateOrderForm();
    initScrollTop();
    initCounters();
});

// تحميل المنتجات من ملف JSON
async function loadProducts() {
    try {
        // في حالة عدم وجود ملف JSON، نستخدم بيانات افتراضية
        const defaultProducts = {
            "products": [
                {
                    "id": 1,
                    "name": "هاتف ذكي متطور",
                    "description": "هاتف ذكي بشاشة 6.5 بوصة، كاميرا 48 ميجابكسل، وذاكرة 128 جيجابايت.",
                    "price": 699999,
                    "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop",
                    "category": "إلكترونيات"
                },
                {
                    "id": 2,
                    "name": "ساعة ذكية رياضية",
                    "description": "ساعة ذكية مقاومة للماء، متوافقة مع iOS وAndroid، تتبع النشاط البدني.",
                    "price": 299999,
                    "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
                    "category": "إلكترونيات"
                },
                {
                    "id": 3,
                    "name": "حقيبة كمبيوتر محمول",
                    "description": "حقيبة أنيقة لحمل الكمبيوتر المحمول بمقاسات مختلفة، مقاومة للماء.",
                    "price": 89999,
                    "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
                    "category": "أكسسوارات"
                },
                {
                    "id": 4,
                    "name": "سماعات لاسلكية",
                    "description": "سماعات لاسلكية عالية الجودة، تشغيل حتى 20 ساعة، ميكروفون مدمج.",
                    "price": 199999,
                    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
                    "category": "إلكترونيات"
                },
                {
                    "id": 5,
                    "name": "كتاب تطوير الويب",
                    "description": "كتاب شامل لتعلم تطوير الويب باستخدام HTML، CSS، وJavaScript.",
                    "price": 49999,
                    "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
                    "category": "كتب"
                },
                {
                    "id": 6,
                    "name": "كوب حراري",
                    "description": "كوب حراري يحافظ على درجة حرارة المشروبات لمدة تصل إلى 6 ساعات.",
                    "price": 29999,
                    "image": "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=300&fit=crop",
                    "category": "أدوات منزلية"
                },
                {
                    "id": 7,
                    "name": "لوحة مفاتيح ميكانيكية",
                    "description": "لوحة مفاتيح ميكانيكية بإضاءة RGB، تصميم مريح للكتابة الطويلة.",
                    "price": 149999,
                    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop",
                    "category": "إلكترونيات"
                },
                {
                    "id": 8,
                    "name": "شاحن لاسلكي سريع",
                    "description": "شاحن لاسلكي سريع 15 واط، متوافق مع معظم الهواتف الذكية.",
                    "price": 59999,
                    "image": "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=300&fit=crop",
                    "category": "إلكترونيات"
                }
            ]
        };
        
        // محاولة تحميل ملف JSON أولاً
        try {
            const response = await fetch('products.json');
            if (response.ok) {
                const data = await response.json();
                products = data.products;
            } else {
                products = defaultProducts.products;
            }
        } catch (error) {
            products = defaultProducts.products;
        }
        
        displayProducts(products.slice(0, displayedProducts));
        
        // إظهار زر "عرض المزيد" إذا كان هناك منتجات أكثر
        if (products.length > displayedProducts) {
            viewMoreBtn.style.display = 'inline-flex';
        }
    } catch (error) {
        console.error('Error loading products:', error);
        productsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>عذرًا، حدث خطأ في تحميل المنتجات. يرجى المحاولة مرة أخرى لاحقًا.</p>
            </div>
        `;
    }
}

// عرض المنتجات في الصفحة
function displayProducts(productsToDisplay) {
    if (!productsContainer) return;
    
    if (productsToDisplay.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products">
                <i class="fas fa-box-open"></i>
                <p>لا توجد منتجات في هذا القسم</p>
            </div>
        `;
        return;
    }
    
    // إذا كان هذا هو العرض الأول، امسح المحتوى
    if (displayedProducts === 6) {
        productsContainer.innerHTML = '';
    }
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-badge">جديد</div>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">
                        ${formatPrice(product.price)} <span>دينار</span>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> أضف إلى السلة
                    </button>
                </div>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // إضافة مستمعي الأحداث لأزرار "أضف إلى السلة"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
            
            // تأثير اهتزاز الزر
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// تنسيق السعر
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// إضافة المنتج إلى سلة المشتريات
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCart();
    showNotification(`تمت إضافة "${product.name}" إلى سلة المشتريات`);
    
    // تأثير اهتزاز عداد السلة
    cartCount.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartCount.style.transform = '';
    }, 300);
}

// حفظ السلة في localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// تحديث عرض سلة المشتريات
function updateCart() {
    updateCartCount();
    updateCartItems();
    updateCartTotal();
    updateOrderForm();
}

// تحديث عداد السلة
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // تأثير ظهور/اختفاء العداد
    if (totalItems > 0) {
        cartCount.style.display = 'flex';
    } else {
        cartCount.style.display = 'none';
    }
}

// تحديث عناصر السلة في الشريط الجانبي
function updateCartItems() {
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>سلة المشتريات فارغة</p>
                <a href="#products" class="browse-products">
                    <i class="fas fa-store"></i> تصفح المنتجات
                </a>
            </div>
        `;
        return;
    }
    
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">${formatPrice(item.price)} دينار</p>
                <div class="cart-item-actions">
                    <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // إضافة مستمعي الأحداث للأزرار داخل السلة
    document.querySelectorAll('.decrease-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.increase-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(productId, 1);
            
            // تأثير اهتزاز الزر
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// تحديث كمية عنصر في السلة
function updateCartItemQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            const productName = cart[itemIndex].name;
            cart.splice(itemIndex, 1);
            showNotification(`تمت إزالة "${productName}" من السلة`);
        } else {
            showNotification('تم تحديث كمية المنتج');
        }
        
        saveCart();
        updateCart();
    }
}

// إزالة المنتج من السلة
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        const productName = cart[itemIndex].name;
        cart.splice(itemIndex, 1);
        saveCart();
        updateCart();
        showNotification(`تمت إزالة "${productName}" من السلة`);
    }
}

// تحديث المجموع الكلي للسلة
function updateCartTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal;
    
    cartSubtotal.textContent = formatPrice(subtotal);
    cartTotal.textContent = formatPrice(total);
}

// تحديث نموذج الطلب
function updateOrderForm() {
    if (!cartSummary || !formProductsTotal) return;
    
    // تحديث ملخص السلة في النموذج
    if (cart.length === 0) {
        cartSummary.innerHTML = `
            <div class="empty-summary">
                <i class="fas fa-shopping-cart"></i>
                <p>لا توجد منتجات في السلة</p>
            </div>
        `;
        formProductsTotal.textContent = '0.00 دينار';
        formShippingCost.textContent = '0.00 دينار';
        formGrandTotal.textContent = '0.00 دينار';
        return;
    }
    
    let summaryHTML = '';
    let productsTotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        productsTotal += itemTotal;
        
        summaryHTML += `
            <div class="summary-item">
                <div>
                    <span class="summary-item-name">${item.name}</span>
                    <span class="summary-item-quantity">× ${item.quantity}</span>
                </div>
                <span class="summary-item-price">${formatPrice(itemTotal)} دينار</span>
            </div>
        `;
    });
    
    cartSummary.innerHTML = summaryHTML;
    formProductsTotal.textContent = `${formatPrice(productsTotal)} دينار`;
    
    // تحديث تكلفة الشحن والمجموع الكلي
    updateShippingAndTotal();
}

// تحديث تكلفة الشحن والمجموع الكلي
function updateShippingAndTotal() {
    if (!shippingSelect) return;
    
    const productsTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingValue = shippingSelect.value;
    let shippingCost = 0;
    
    switch (shippingValue) {
        case 'inside_city':
            shippingCost = 5000;
            break;
        case 'outside_city':
            shippingCost = 10000;
            break;
        case 'pickup':
            shippingCost = 0;
            break;
        default:
            shippingCost = 0;
    }
    
    const grandTotal = productsTotal + shippingCost;
    
    formShippingCost.textContent = `${formatPrice(shippingCost)} دينار`;
    formGrandTotal.textContent = `${formatPrice(grandTotal)} دينار`;
}

// عرض إشعار للمستخدم
function showNotification(message) {
    if (!notification || !notificationText) return;
    
    notificationText.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// تهيئة العدادات المتحركة
function initCounters() {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (current > target) current = target;
                
                // إذا كان الرقم عشريًا (مثل 4.9)
                if (target % 1 !== 0) {
                    counter.textContent = current.toFixed(1);
                } else {
                    counter.textContent = Math.floor(current);
                }
                
                setTimeout(updateCounter, 20);
            }
        };
        
        // تشغيل العد عند التمرير للقسم
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// تهيئة زر العودة للأعلى
function initScrollTop() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // فتح/إغلاق سلة المشتريات
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // إغلاق السلة عند النقر خارجها
    document.addEventListener('click', (e) => {
        if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target) && cartSidebar.classList.contains('active')) {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // زر القائمة المتنقلة
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // فلترة المنتجات حسب التصنيف
    if (filterButtons) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // إزالة النشط من جميع الأزرار
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // إضافة النشط للزر المضغوط
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                filterProducts(category);
            });
        });
    }
    
    // تحديث تكلفة الشحن عند تغيير الخيار
    if (shippingSelect) {
        shippingSelect.addEventListener('change', updateShippingAndTotal);
    }
    
    // إرسال نموذج الطلب
    if (orderForm) {
        orderForm.addEventListener('submit', submitOrder);
    }
    
    // زر متابعة الطلب
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('سلة المشتريات فارغة. أضف منتجات قبل متابعة الطلب.');
                return;
            }
            
            cartSidebar.classList.remove('active');
            document.body.style.overflow = 'auto';
            document.getElementById('order').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
    
    // زر عرض المزيد من المنتجات
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            displayedProducts += 3;
            
            let filteredProducts = products;
            if (currentFilter !== 'all') {
                filteredProducts = products.filter(product => product.category === currentFilter);
            }
            
            // عرض المنتجات الإضافية
            const additionalProducts = filteredProducts.slice(0, displayedProducts);
            displayProducts(additionalProducts);
            
            // إخفاء الزر إذا تم عرض جميع المنتجات
            if (displayedProducts >= filteredProducts.length) {
                viewMoreBtn.style.display = 'none';
            }
        });
    }
    
    // إغلاق القائمة المتنقلة عند النقر على رابط
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
    
    // تأثير التمرير على الهيدر
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // إضافة تأثيرات عند تحميل الصفحة
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
}

// فلترة المنتجات حسب التصنيف
function filterProducts(category) {
    currentFilter = category;
    displayedProducts = 6;
    
    if (category === 'all') {
        displayProducts(products.slice(0, displayedProducts));
        
        // إظهار زر "عرض المزيد" إذا كان هناك منتجات أكثر
        if (products.length > displayedProducts) {
            viewMoreBtn.style.display = 'inline-flex';
        } else {
            viewMoreBtn.style.display = 'none';
        }
        return;
    }
    
    const filteredProducts = products.filter(product => product.category === category);
    displayProducts(filteredProducts.slice(0, displayedProducts));
    
    // إظهار زر "عرض المزيد" إذا كان هناك منتجات أكثر
    if (filteredProducts.length > displayedProducts) {
        viewMoreBtn.style.display = 'inline-flex';
    } else {
        viewMoreBtn.style.display = 'none';
    }
}

// إرسال نموذج الطلب
function submitOrder(e) {
    e.preventDefault();
    
    if (cart.length === 0) {
        showNotification('سلة المشتريات فارغة. أضف منتجات قبل تقديم الطلب.');
        return;
    }
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const shipping = shippingSelect.options[shippingSelect.selectedIndex].text;
    const payment = document.getElementById('payment').value;
    const notes = document.getElementById('notes').value;
    
    // التحقق من صحة البيانات
    if (!name || !phone || !email || !address) {
        showNotification('يرجى ملء جميع الحقول المطلوبة.');
        return;
    }
    
    // تجميع تفاصيل المنتجات
    let productsDetails = '';
    cart.forEach((item, index) => {
        productsDetails += `${index + 1}. ${item.name} - الكمية: ${item.quantity} - السعر: ${formatPrice(item.price)} دينار - الإجمالي: ${formatPrice(item.price * item.quantity)} دينار\n`;
    });
    
    const productsTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingValue = shippingSelect.value;
    let shippingCost = 0;
    
    switch (shippingValue) {
        case 'inside_city':
            shippingCost = 5000;
            break;
        case 'outside_city':
            shippingCost = 10000;
            break;
        default:
            shippingCost = 0;
    }
    
    const grandTotal = productsTotal + shippingCost;
    
    // إنشاء نص البريد الإلكتروني
    const subject = `طلب جديد من ${name}`;
    const body = `تفاصيل الطلب:

معلومات العميل:
الاسم: ${name}
الهاتف: ${phone}
البريد الإلكتروني: ${email}
العنوان: ${address}

تفاصيل المنتجات:
${productsDetails}

تكاليف الشحن:
${shipping}

طريقة الدفع:
${payment === 'cash' ? 'الدفع عند الاستلام' : 'تحويل بنكي'}

ملاحظات إضافية:
${notes || 'لا توجد ملاحظات'}

المجموع:
مجموع المنتجات: ${formatPrice(productsTotal)} دينار
تكلفة الشحن: ${formatPrice(shippingCost)} دينار
المجموع الكلي: ${formatPrice(grandTotal)} دينار

--- 
تم إرسال هذا الطلب من الموقع الإلكتروني.
المطور: أحمد عمار العمري`;
    
    // إنشاء رابط mailto
    const mailtoLink = `mailto:ahmed@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // فتح تطبيق البريد الإلكتروني
    window.location.href = mailtoLink;
    
    // تفريغ السلة بعد الإرسال
    cart = [];
    saveCart();
    updateCart();
    
    // إظهار رسالة نجاح
    showNotification('تم إرسال طلبك بنجاح! سيتم التواصل معك قريبًا.');
    
    // إعادة تعيين النموذج
    orderForm.reset();
    updateOrderForm();
}