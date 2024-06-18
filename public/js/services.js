document.addEventListener('DOMContentLoaded', function () {
    // Accordion functionality for FAQs
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
            const content = item.querySelector('p');
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = "0";
            }
        });
    });

    // Modal functionality for service details
    const modal = document.createElement('div');
    modal.classList.add('modal');
    document.body.appendChild(modal);

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modal.appendChild(modalContent);

    const closeModal = document.createElement('span');
    closeModal.classList.add('close');
    closeModal.innerHTML = '&times;';
    modalContent.appendChild(closeModal);

    const modalText = document.createElement('div');
    modalText.classList.add('modal-text');
    modalContent.appendChild(modalText);

    const serviceButtons = document.querySelectorAll('.details-btn');

    serviceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const service = button.dataset.service;
            let serviceText = '';

            switch (service) {
                case 'financial-planning':
                    serviceText = `
                        <h3>Financial Planning</h3>
                        <p>Our financial planning services are designed to help you achieve your financial goals. We take a comprehensive approach to understand your current financial situation, future goals, and risk tolerance. Our services include:</p>
                        <ul>
                            <li>Budgeting and saving strategies</li>
                            <li>Investment planning</li>
                            <li>Retirement planning</li>
                            <li>Tax planning</li>
                            <li>Estate planning</li>
                        </ul>
                        <p>Our team of experts will work with you to create a customized plan that ensures your financial future is secure and well-organized.</p>
                    `;
                    break;
                case 'investment-advice':
                    serviceText = `
                        <h3>Investment Advice</h3>
                        <p>Our investment advice services are tailored to help you grow your wealth through informed and strategic decisions. We offer:</p>
                        <ul>
                            <li>Portfolio management</li>
                            <li>Risk assessment and management</li>
                            <li>Diversification strategies</li>
                            <li>Market analysis and insights</li>
                            <li>Investment in stocks, bonds, and real estate</li>
                        </ul>
                        <p>We provide continuous monitoring and adjustment of your investment portfolio to ensure optimal performance and alignment with your financial goals.</p>
                    `;
                    break;
                case 'retirement-planning':
                    serviceText = `
                        <h3>Retirement Planning</h3>
                        <p>Plan for a secure and comfortable retirement with our comprehensive retirement planning services. We help you:</p>
                        <ul>
                            <li>Determine your retirement needs and goals</li>
                            <li>Calculate the amount you need to save</li>
                            <li>Choose the right retirement accounts and investments</li>
                            <li>Plan for healthcare and other expenses</li>
                            <li>Create a sustainable withdrawal strategy</li>
                        </ul>
                        <p>Our experts will guide you through every step of the process to ensure you can retire with confidence and peace of mind.</p>
                    `;
                    break;
                case 'tax-planning':
                    serviceText = `
                        <h3>Tax Planning</h3>
                        <p>Optimize your tax strategy with our expert tax planning services. We help you:</p>
                        <ul>
                            <li>Identify tax-saving opportunities</li>
                            <li>Plan for tax-efficient investments</li>
                            <li>Understand and leverage tax credits and deductions</li>
                            <li>Navigate complex tax regulations</li>
                            <li>Minimize your tax liability</li>
                        </ul>
                        <p>Our team of tax professionals will work with you to create a tax strategy that aligns with your financial goals and maximizes your savings.</p>
                    `;
                    break;
                case 'estate-planning':
                    serviceText = `
                        <h3>Estate Planning</h3>
                        <p>Protect your legacy with our comprehensive estate planning services. We help you:</p>
                        <ul>
                            <li>Create a will and trusts</li>
                            <li>Plan for the distribution of your assets</li>
                            <li>Minimize estate taxes</li>
                            <li>Designate beneficiaries and guardians</li>
                            <li>Prepare for incapacity with powers of attorney</li>
                        </ul>
                        <p>Our experts will ensure that your estate plan reflects your wishes and provides for your loved ones.</p>
                    `;
                    break;
                case 'insurance-planning':
                    serviceText = `
                        <h3>Insurance Planning</h3>
                        <p>Secure your assets and protect your family with our tailored insurance planning services. We provide guidance on:</p>
                        <ul>
                            <li>Life insurance</li>
                            <li>Health insurance</li>
                            <li>Disability insurance</li>
                            <li>Long-term care insurance</li>
                            <li>Property and casualty insurance</li>
                        </ul>
                        <p>We will help you choose the right insurance products to meet your needs and ensure comprehensive coverage.</p>
                    `;
                    break;
            }

            modalText.innerHTML = serviceText;
            modal.style.display = 'block';
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
