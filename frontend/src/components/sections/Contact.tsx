import { Card } from '../ui-kit/Card';
import { EnquiryForm } from '../common/EnquiryForm';


interface ContactProps {
    showMap?: boolean;
    showForm?: boolean;
}

export function Contact({ showMap = true, showForm = false }: ContactProps) {
    return (
        <section id="contact" className="py-10 bg-white" style={{ marginTop: "0px" }}>
            <div className="container mx-auto px-4 md:px-6">
                {showForm && (
                    <div className="flex justify-center mb-16">
                        {/* Enquiry Form */}
                        <div className="w-full lg:w-[70%]">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Get In Touch</h2>
                                <p className="text-gray-600">Have questions? We'd love to hear from you.</p>
                            </div>
                            <Card className="p-8 border-t-8 border-t-brand-blue">
                                <h3 className="text-2xl font-bold mb-6">Send an Enquiry</h3>
                                <EnquiryForm type="TRAINING" />
                            </Card>
                        </div>
                    </div>
                )}

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
