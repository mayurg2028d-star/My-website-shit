# ---- Step 20 practice: working directory and file paths ----
# BEFORE RUNNING: set the working directory to THIS project folder.
# In RStudio: Session menu > Set Working Directory > To Source File Location

getwd()          # shows the folder R is currently using
list.files()     # should show: "data"  "step20_paths.R"
list.files("data")   # should show: "raw_data.csv"

# Relative path: start from the working folder, go into "data", open the file
data <- read.csv("data/raw_data.csv")
# read.csv loads the CSV into a data frame called data

print(data)      # show the table
str(data)        # structure: 5 rows, 4 columns and their types
mean(data$sales) # average of the sales column
