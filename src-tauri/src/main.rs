#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

/*extern crate discord_rpc_client;
use discord_rpc_client::Client;
use discord_rpc_client::models::*;
static CACHE_ID: String = "".to_string();

#[tauri::command]
unsafe fn discord_rpc(client_id: String, state: String, details: String, large_image_key: String, small_image_key: String, large_image_text: String, small_image_text: String, start_time: u64) {
  let mut drpc = Client::new(client_id.parse::<u64>().unwrap());

  if client_id != CACHE_ID {
    DISCORD_CLIENT = Client::new(client_id.parse::<u64>().unwrap());
    DISCORD_CLIENT.start(2);
    CACHE_ID = client_id;
  }

  if let Err(why) = DISCORD_CLIENT.clear_activity() {
    println!("Failed to clear presence: {}", why);
  }

  let mut assets = ActivityAssetsBuilder::default();
  if !large_image_key.is_empty() {
    assets.large_image(large_image_key);
  }
  if !large_image_text.is_empty() {
    assets.large_text(large_image_text);
  }
  if !small_image_key.is_empty() {
    assets.small_image(small_image_key);
  }
  if !small_image_text.is_empty() {
    assets.small_text(small_image_text);
  }

  let mut timestamps = ActivityTimestampsBuilder::default();
  timestamps.start(start_time);

  let mut activity = ActivityBuilder::default();
  if !state.is_empty() {
    activity.state(state);
  }
  if !details.is_empty() {
    activity.details(details);
  }
  activity.timestamps(timestamps.build().unwrap());
  activity.assets(assets.build().unwrap());

  if let Err(why) = DISCORD_CLIENT.set_activity(activity.build().unwrap()) {
    println!("Failed to set presence: {}", why);
  }

}*/

fn main() {
  tauri::Builder::default()
    //.invoke_handler(tauri::generate_handler![discord_rpc])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
