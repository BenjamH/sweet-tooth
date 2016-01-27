class SearchesController < ApplicationController


  def create
    long = params[:location][:longitude]
    lat = params[:location][:latitude]
    coordinates = { latitude: lat.to_f, longitude: long.to_f }
    params = { term: 'ice cream',
                radius_filter: 3000
              }
     shops = []
     Yelp.client.search_by_coordinates(coordinates,params).businesses.each do |business|
       biz_info = {}
       categories = ["Ice Cream & Frozen Yogurt", "icecream", "Gelato"]
       categories.each do |category|
          if business.categories.flatten[0].include?(category)
             biz_info['name']=business.name
             biz_info['phone']=business.phone
             biz_info['address']=business.location.address.first
             biz_info['longitude']=business.location.coordinate.longitude
             biz_info['latitude']=business.location.coordinate.latitude
             biz_info['rating']=business.rating
             biz_info['text']=business.snippet_text
             biz_info['image']=business.image_url
             shops << biz_info
          end
        end
     end

     respond_to do |format|
       data = { :data => shops}
       format.json  { render :json => data }
     end
  end


end
