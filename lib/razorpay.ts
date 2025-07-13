interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  image: string
  order_id: string
  handler: (response: any) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  theme: {
    color: string
  }
  modal: {
    ondismiss: () => void
  }
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void
      close: () => void
    }
  }
}

export const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

export const createRazorpayOrder = async (amount: number, customerInfo: any, cartItems: any, currency: string = 'INR') => {
  try {
    const response = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency,
        customerInfo: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.contact,
          address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}`
        },
        cartItems,
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

export const processPayment = async (
  orderData: any,
  customerInfo: {
    name: string
    email: string
    contact: string
  }
) => {
  const res = await initializeRazorpay()

  if (!res) {
    alert('Razorpay SDK failed to load. Are you online?')
    return
  }

  const options: RazorpayOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'अलंकारिका',
    description: 'Traditional Jewelry Purchase',
    image: '/alankarika-logo.png',
    order_id: orderData.id,
    handler: function (response: any) {
      // Handle successful payment
      verifyPayment({
        ...response,
        orderId: orderData.orderId
      })
    },
    prefill: {
      name: customerInfo.name,
      email: customerInfo.email,
      contact: customerInfo.contact,
    },
    theme: {
      color: '#D97706', // Amber color to match the brand
    },
    modal: {
      ondismiss: function() {
        // console.log('Payment cancelled')
      },
    },
  }

  const rzp = new window.Razorpay(options)
  rzp.open()
}

const verifyPayment = async (paymentData: any) => {
  try {
    
    // Map Razorpay response parameters to our expected format
    const verificationData = {
      razorpay_order_id: paymentData.razorpay_order_id,
      razorpay_payment_id: paymentData.razorpay_payment_id,
      razorpay_signature: paymentData.razorpay_signature,
      orderId: paymentData.orderId
    };
    
    
    const response = await fetch('/api/razorpay/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationData),
    })

    
    if (!response.ok) {
      const errorText = await response.text();
      alert(`Payment verification failed: HTTP ${response.status}`);
      return;
    }

    const data = await response.json()
    
    if (data.success) {
      // Payment verified successfully
      
      // Get order data from the original order response or localStorage
      const storedOrderData = localStorage.getItem('currentOrderData');
      
      if (storedOrderData) {
        const orderData = JSON.parse(storedOrderData);
        orderData.payment_status = 'paid';
        orderData.status = 'confirmed';
        orderData.razorpay_payment_id = paymentData.razorpay_payment_id;
        
        // Store the complete order data for the success page in sessionStorage
        sessionStorage.setItem('paymentSuccessOrderData', JSON.stringify(orderData));
        localStorage.setItem('lastOrderData', JSON.stringify(orderData));
        
        // Clear cart data after successful payment
        localStorage.removeItem('currentOrderData');
        localStorage.removeItem('alankaarika-cart');
        
        window.location.href = `/payment-success?orderId=${paymentData.orderId}`;
      } else {
        window.location.href = `/payment-success?orderId=${paymentData.orderId}`;
      }
    } else {
      // Payment verification failed
      alert(`Payment verification failed: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    alert('Payment verification error')
  }
}
