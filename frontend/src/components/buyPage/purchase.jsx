import { useState } from 'react';
import './PurchaseService.css'; // Import CSS for styling

const services = [
    { id: 1, name: 'Service 1', description: 'Description for Service 1', price: 50000 },
    { id: 2, name: 'Service 2', description: 'Description for Service 2', price: 30000 },
    { id: 3, name: 'Service 3', description: 'Description for Service 3', price: 70000 },
];

const PurchaseService = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [message, setMessage] = useState('');

    const handlePayment = () => {
        const options = {
            key: 'rzp_test_L4tU287IrZGte7', // Replace with your Razorpay key
            amount: selectedService.price, // Amount in paise
            currency: 'INR',
            name: 'Your Service Name',
            description: `Purchase of ${selectedService.name}`,
            handler: (response) => {
                // Handle successful payment here
                setMessage(`Thank you ${name}, your purchase for ${selectedService.name} has been received!`);
                console.log(response);
            },
            prefill: {
                name: name,
                email: email,
            },
            notes: {
                service: selectedService.name,
            },
            theme: {
                color: '#F37254',
            },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedService) {
            handlePayment();
        } else {
            alert("Please select a service.");
        }
    };

    return (
        <div className="purchase-service-container">
            <h2>Purchase Our Service</h2>
            <div className="service-cards">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
                        onClick={() => setSelectedService(service)}
                    >
                        <h3>{service.name}</h3>
                        <p>{service.description}</p>
                        <p>Price: ₹{service.price / 100}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Purchase</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default PurchaseService;
