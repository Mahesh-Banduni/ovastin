export default function ContactForm(){
    return(
        <div className="section-container">
            <div className="flex flex-col md:flex-row gap-scale-sm-10 section-padding">
                <div className="w-full md:w-1/2 flex flex-col gap-scale-md-8">
                    <h3 className="font-semibold!">Leave A Message</h3>
                    <div className="w-full flex flex-col gap-scale-md-5">
                        <div className="flex flex-col gap-scale-sm-2.5 w-full">
                            <label>Name<span className="ml-scale-sm-0.5 text-red-500">*</span></label>
                            <input type="text" placeholder="eg. John Doe" className="w-full h-14 p-scale-sm-3 border-2 border-gray-300 focus:border-gray-300 para-text-md"></input>
                        </div>
                        <div className="flex flex-col gap-scale-sm-2.5 w-full">
                            <label>Email<span className="ml-scale-sm-0.5 text-red-500">*</span></label>
                            <input type="email" placeholder="eg. john@example.com" className="w-full h-14 p-scale-sm-3 border-2 border-gray-300 focus:border-gray-300 para-text-md"></input>
                        </div>
                        <div className="flex flex-col gap-scale-sm-2.5 w-full">
                            <label>Phone<span className="ml-scale-sm-0.5 text-red-500">*</span></label>
                            <input type="tel" placeholder="eg. 887-232323233" className="w-full h-14 p-scale-sm-3 border-2 border-gray-300 focus:border-gray-300 para-text-md"></input>
                        </div>
                        <div className="flex flex-col gap-scale-sm-2.5 w-full">
                          <label htmlFor="inquiry-about">Inquiry About<span className="ml-scale-sm-0.5 text-red-500">*</span></label>

                          <select
                            id="inquiry-about"
                            className="w-full h-14 p-scale-sm-3 border-2 border-gray-300 focus:border-gray-300 para-text-md"
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Select one
                            </option>

                            <option value="option-1">Option 1</option>
                            <option value="option-2">Option 2</option>
                            <option value="option-3">Option 3</option>
                            <option value="option-4">Option 4</option>
                            <option value="option-5">Option 5</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-scale-sm-2.5 w-full">
                            <label>Message<span className="ml-scale-sm-0.5 text-red-500">*</span></label>
                            <textarea placeholder="eg. I want to enquire about the commercial property in New York city" className="w-full h-40 p-scale-sm-3 border-2 border-gray-300 focus:border-gray-300 para-text-md"></textarea>
                        </div>
                    </div>
                    <button className="btn btn-secondary btn-md w-full">Submit Now</button>
                </div>
                <div className="w-full md:w-1/2 h-80 md:h-auto overflow-hidden rounded-xl">
                  <iframe
                    title="Our Location"
                    src="https://www.google.com/maps?q=16315+Hwy+10,+Tahlequah,+OK+74464&output=embed"
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
            </div>
        </div>
    )
}