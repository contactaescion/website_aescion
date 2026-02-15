// import { Card } from '../ui-kit/Card';
// import { EnquiryForm } from '../common/EnquiryForm';


interface ContactProps {
    showMap?: boolean;
}

export function Contact({ showMap = true }: ContactProps) {
    return (
        <section id="contact" className="py-10 bg-white" style={{ marginTop: "0px" }}>
            <div className="container mx-auto px-4 md:px-6">
                {/* Enquiry Form Removed per user request */}

                {/* Google Map Embed - Full Width Below */}
                {showMap && (
                    <div className="mt-16 rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-[400px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2597.435453417162!2d77.72265439533734!3d8.729137110217543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0411ff5689aa91%3A0x77874ccbd7fe72d8!2sAESCION%20EDTECH%20SOLUTIONS!5e1!3m2!1sen!2sin!4v1770187230280!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
