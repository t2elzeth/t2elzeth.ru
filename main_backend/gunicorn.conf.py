import multiprocessing

pythonpath = '/app'
bind = '0.0.0.0:8000'
workers = multiprocessing.cpu_count() * 2 + 1
user = 'root'
capture_output = True
accesslog = '-'
errorlog = '-'
limit_request_field_size = 0
