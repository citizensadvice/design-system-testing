# frozen_string_literal: true

desc "Generate examples"
task generate_examples: :environment do
  @session ||= ActionDispatch::Integration::Session.new(Rails.application)

  # Default host for integration sessions is example.com,
  # set to localhost to bypass host warning
  @session.host = "localhost"

  ViewComponent::Preview.all.each do |preview|
    preview.examples.each do |example|
      component_name = preview.preview_name.split("/").last.chomp("_component")
      component_path = "#{preview.preview_name}/#{example}"

      @session.get "/rails/view_components/#{component_path}"
      doc = Nokogiri::HTML.parse(@session.response.body)

      component_html = doc.css("#content").inner_html

      output_path = Rails.application.root.join("../styleguide/examples/#{component_name}/#{example}.html")

      dirname = File.dirname(output_path)
      FileUtils.mkdir_p(dirname) unless File.directory?(dirname)

      puts "Writing example to #{output_path}"

      File.write output_path, HtmlBeautifier.beautify(component_html.to_s.strip)
    end
  end
end